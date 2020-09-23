import { DateTime } from 'luxon';

import ActionTypes from '~/store/token/types';
import core from '~/services/core';
import logError from '~/utils/debug';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';
import { addPendingActivity } from '~/store/activity/actions';
import { getLastPayout, setLastPayout } from '~/services/token';
import { isTokenDeployed } from '~/utils/isDeployed';

const { ActivityTypes } = core.activity;

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
      await core.token.deploy(safe.pendingAddress);
      await isTokenDeployed(safe.pendingAddress);

      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_ERROR,
      });

      logError(error);

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
        throw new Error('Invalid Token address');
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
    if (!token.address) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_BALANCE_UPDATE,
    });

    try {
      const currentValue = await core.token.getBalance(safe.currentAccount);
      const { activity } = getState();

      // Add value changes based on pending activities
      const pendingValueDiff = activity.activities.reduce(
        (acc, { type, data, isPending }) => {
          if (!isPending) {
            return acc;
          }

          if (type === ActivityTypes.TRANSFER && data.from === ZERO_ADDRESS) {
            // UBI payout
            return acc.add(web3.utils.toBN(data.value));
          } else if (
            type === ActivityTypes.HUB_TRANSFER &&
            data.to === safe.currentAccount
          ) {
            // Received Circles
            return acc.add(web3.utils.toBN(data.value));
          } else if (
            type === ActivityTypes.HUB_TRANSFER &&
            data.from === safe.currentAccount
          ) {
            // Sent Circles
            return acc.sub(web3.utils.toBN(data.value));
          }

          return acc;
        },
        new web3.utils.BN(),
      );

      // Add pending value changes to the current one
      const mixedValue = currentValue.add(pendingValueDiff);

      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS,
        meta: {
          balance: mixedValue.toString(),
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

      dispatch(checkCurrentBalance());

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

export function transfer(to, amount) {
  return async (dispatch, getState) => {
    dispatch({
      type: ActionTypes.TOKEN_TRANSFER,
    });

    const { safe } = getState();
    const from = safe.currentAccount;

    try {
      const value = new web3.utils.BN(core.utils.toFreckles(amount));
      const txHash = await core.token.transfer(from, to, value);

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

      dispatch(checkCurrentBalance());

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
