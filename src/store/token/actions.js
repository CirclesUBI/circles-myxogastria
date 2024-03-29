import { tcToCrc } from '@circles/timecircles';
import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React from 'react';

import core from '~/services/core';
import translate from '~/services/locale';
import { getLastPayout, setLastPayout } from '~/services/token';
import web3 from '~/services/web3';
import { addPendingActivity } from '~/store/activity/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import ActionTypes from '~/store/token/types';
import { PATHFINDER_HOPS_DEFAULT, ZERO_ADDRESS } from '~/utils/constants';
import logError, { translateErrorForUser } from '~/utils/debug';
import { formatCirclesValue } from '~/utils/format';
import { isTokenDeployed, waitAndRetryOnFail } from '~/utils/stateChecks';

const { ActivityTypes } = core.activity;
const { ErrorCodes, TransferError } = core.errors;

export function deployToken() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Token address already exists
    if (token.address) {
      return;
    }

    // No pending deployment
    if (!safe.pendingAddress) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_DEPLOY,
    });

    try {
      await waitAndRetryOnFail(
        async () => {
          return await core.token.deploy(safe.pendingAddress);
        },
        async () => {
          return await isTokenDeployed(safe.pendingAddress);
        },
      );

      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_SUCCESS,
      });
    } catch (error) {
      logError(error);

      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_ERROR,
      });

      throw error;
    }
  };
}

export function updateTokenFundedState(isFunded) {
  return {
    type: ActionTypes.TOKEN_FUNDED_UPDATE,
    meta: {
      isFunded,
    },
  };
}

export function checkTokenState() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Safe address is not known or deployed yet
    if (safe.pendingAddress || safe.pendingNonce) {
      // ... reset Token when it was set before
      if (token.address) {
        dispatch({
          type: ActionTypes.TOKEN_RESET,
        });
      }

      return;
    }

    if (!safe.currentAccount) {
      return;
    }

    // Organizations don't have a Token
    if (safe.isOrganization) {
      if (token.address) {
        dispatch(resetToken());
      }

      return;
    }

    // Token address already exists
    if (token.address) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_UPDATE,
    });

    const errorZeroAddress = `Invalid Token address for ${safe.currentAccount}`;
    try {
      const address = await core.token.getAddress(safe.currentAccount);

      if (address === ZERO_ADDRESS) {
        throw new Error(errorZeroAddress);
      }

      dispatch({
        type: ActionTypes.TOKEN_UPDATE_SUCCESS,
        meta: {
          address,
          lastPayoutAt: getLastPayout(),
        },
      });
    } catch (error) {
      const action = error.message?.includes(errorZeroAddress)
        ? notify({
            text: translate('ErrorCodes.ErrorTokenNotDeployed'),
            type: NotificationsTypes.ERROR,
          })
        : {
            type: ActionTypes.TOKEN_UPDATE_ERROR,
          };
      dispatch(action);
      logError(error);

      throw error;
    }
  };
}

export function checkCurrentBalance() {
  return async (dispatch, getState) => {
    const { token, safe } = getState();

    // No token address given yet
    if (!token.address && !safe.isOrganization) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_BALANCE_UPDATE,
    });

    try {
      const balance = await core.token.getBalance(safe.currentAccount);

      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS,
        meta: {
          balance: balance.toString(),
        },
      });
    } catch {
      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_ERROR,
      });
    }
  };
}

export function checkOtherTokens() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    try {
      const otherTokens = await core.token.listAllTokens(safe.currentAccount);

      const filterOrderedOtherTokens = otherTokens
        .filter(
          (item) =>
            formatCirclesValue(item.amount, Date.now(), 2, false) > 0.005,
        )
        .reverse();
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_OTHER_TOKENS,
        meta: {
          otherTokens: filterOrderedOtherTokens,
        },
      });
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_LOADING,
        meta: {
          isLoading: false,
        },
      });
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_ERROR,
        meta: {
          isError: true,
        },
      });
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translateErrorForUser(error)}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };
}

export function checkOtherTokensLoading(isLoading) {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_LOADING,
      meta: {
        isLoading,
      },
    });
  };
}

export function requestUBIPayout(payout) {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // No token address given yet
    if (!token.address) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_UBI_PAYOUT,
    });

    try {
      const txHash = await core.token.requestUBIPayout(safe.currentAccount);

      const lastPayoutAt = DateTime.local().toISO();
      setLastPayout(lastPayoutAt);

      dispatch(
        addPendingActivity({
          txHash,
          type: ActivityTypes.TRANSFER,
          data: {
            from: ZERO_ADDRESS,
            to: safe.currentAccount,
            value: payout.toString(),
          },
        }),
      );

      dispatch({
        type: ActionTypes.TOKEN_UBI_PAYOUT_SUCCESS,
        meta: {
          lastPayoutAt,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_UBI_PAYOUT_ERROR,
      });

      throw error;
    }
  };
}

// Recursive helper function for transfer
async function loopTransfer(
  from,
  to,
  value,
  paymentNote,
  hops,
  attemptsLeft,
  errorsMessages = '',
) {
  if (attemptsLeft === 0 || hops === 0) {
    // ran out of attempts or hops, cannot attempt further transfers
    throw new TransferError(errorsMessages);
  }
  try {
    return await core.token.transfer(from, to, value, paymentNote, hops);
  } catch (transferError) {
    // RETRY when path is not found or is too long
    // UPDATE edges database when the path fails and then retry
    // GIVE UP for other errors
    // ---
    // no path or path too long
    if (
      transferError.name === 'TransferError' &&
      (transferError.code === ErrorCodes.TOO_COMPLEX_TRANSFER || // too many steps in found path
        transferError.code === ErrorCodes.UNKNOWN_ERROR || // includes timeout error from api
        transferError.code === ErrorCodes.INVALID_TRANSFER) // other errors from find transitive transfer
    ) {
      // retry with fewer hops
      return await loopTransfer(
        from,
        to,
        value,
        paymentNote,
        hops - 1,
        attemptsLeft - 1,
        errorsMessages.concat(' ', transferError.message),
      );
    }
    // if the path is found but it is invalid
    else if (
      // search complete and no path found
      (transferError.name === 'TransferError' &&
        ErrorCodes.TRANSFER_NOT_FOUND) ||
      // includes errors from attempting transfer with an invalid path
      transferError.name !== 'TransferError'
    ) {
      // update the edges db for trust-adjacent safes
      try {
        await core.token.updateTransferSteps(from, to, value, hops);
      } catch (updateError) {
        return await loopTransfer(
          from,
          to,
          value,
          paymentNote,
          hops - 1,
          attemptsLeft - 1,
          errorsMessages.concat(
            ' ',
            transferError.message,
            updateError.message,
          ),
        );
      }
      // try again after update with the same parameters
      return await loopTransfer(
        from,
        to,
        value,
        paymentNote,
        hops,
        attemptsLeft - 1,
        errorsMessages.concat(' ', transferError.message),
      );
    }
    // any other errors will result in propagating the error
    else {
      throw transferError;
    }
  }
}

/**
 * Transfer circles to another safe
 * @param {string} to Receiver safe address of Circles transfer
 * @param {number} amount Amount in Time Circles
 * @param {string} paymentNote Message for recipient
 * @param {number} hops Maximum number of trust hops away from them sending user inside the trust network for finding transaction steps
 * @param {number} attempts Maximum number of transfer attempts before accepting defeat
 * @returns response
 */
export function transfer(
  to,
  amount,
  paymentNote = '',
  hops = PATHFINDER_HOPS_DEFAULT,
  attempts = PATHFINDER_HOPS_DEFAULT + 1,
) {
  return async (dispatch, getState) => {
    dispatch({
      type: ActionTypes.TOKEN_TRANSFER,
    });

    const { safe } = getState();
    const from = safe.currentAccount;

    try {
      const value = new web3.utils.BN(
        core.utils.toFreckles(tcToCrc(Date.now(), Number(amount))),
      );
      let txHash;

      if (process.env.PATHFINDER_TYPE === 'cli') {
        txHash = await loopTransfer(
          from,
          to,
          value,
          paymentNote,
          hops,
          attempts,
        );
      } else {
        txHash = await core.token.transfer(from, to, value, paymentNote);
      }

      if (txHash !== null) {
        dispatch(
          addPendingActivity({
            txHash,
            type: ActivityTypes.HUB_TRANSFER,
            data: {
              from,
              to,
              value: value.toString(),
            },
          }),
        );

        dispatch({
          type: ActionTypes.TOKEN_TRANSFER_SUCCESS,
        });
      } else {
        // "TransactionServiceException: execution reverted" as an example coming from  core.token.transfer
        throw new TransferError();
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_TRANSFER_ERROR,
      });

      throw error;
    }
  };
}

export function resetToken() {
  return {
    type: ActionTypes.TOKEN_RESET,
  };
}
