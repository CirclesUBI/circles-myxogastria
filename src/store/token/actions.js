import { tcToCrc } from '@circles/timecircles';
import { DateTime } from 'luxon';

import core from '~/services/core';
import { getLastPayout, setLastPayout } from '~/services/token';
import web3 from '~/services/web3';
import { addPendingActivity } from '~/store/activity/actions';
import ActionTypes from '~/store/token/types';
import { PATHFINDER_HOPS_DEFAULT, ZERO_ADDRESS } from '~/utils/constants';
import logError from '~/utils/debug';
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

    try {
      const address = await core.token.getAddress(safe.currentAccount);

      if (address === ZERO_ADDRESS) {
        throw new Error(`Invalid Token address for ${safe.currentAccount}`);
      }

      dispatch({
        type: ActionTypes.TOKEN_UPDATE_SUCCESS,
        meta: {
          address,
          lastPayoutAt: getLastPayout(),
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_ERROR,
      });

      throw error;
    }
  };
}

export function checkCurrentBalance() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

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
  } catch (error) {
    // RETRY when path is not found or is too long
    // UPDATE edges database when the path fails and then retry
    // GIVE UP for other errors
    // ---
    // no path or path too long
    if (
      error.name === 'TransferError' &&
      (error.code === ErrorCodes.TOO_COMPLEX_TRANSFER || // too many steps in found path
        error.code === ErrorCodes.UNKNOWN_ERROR || // includes timeout error from api
        error.code === ErrorCodes.INVALID_TRANSFER) // other errors from find transitive transfer
    ) {
      // retry with fewer hops
      return await loopTransfer(
        from,
        to,
        value,
        paymentNote,
        hops - 1,
        attemptsLeft - 1,
        errorsMessages.concat(' ', error.message),
      );
    }
    // if the path is found but it is invalid
    else if (
      (error.name === 'TransferError' && ErrorCodes.TRANSFER_NOT_FOUND) || // search complete and no path found
      error.name !== 'TransferError' // includes errors from attempting transfer with an invalid path
    ) {
      // update the edges db for trust-adjacent safes
      await core.token.updateTransferSteps(from, to, value, hops);
      // try again after update with the same parameters
      return await loopTransfer(
        from,
        to,
        value,
        paymentNote,
        hops,
        attemptsLeft - 1,
        errorsMessages.concat(' ', error.message),
      );
    }
    // any other errors will result in propagating the error
    else {
      throw error;
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
      const txHash = await loopTransfer(
        from,
        to,
        value,
        paymentNote,
        hops,
        attempts,
      );

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
