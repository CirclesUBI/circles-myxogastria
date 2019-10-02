import ActionTypes from '~/store/token/types';
import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';
import { ZERO_ADDRESS } from '~/utils/constants';
import { getBalance, getTokenAddress, signup } from '~/services/core';

export function deployNewToken() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Token address already exists
    if (token.address) {
      return;
    }

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_DEPLOY,
    });

    try {
      const address = await signup(safe.address);

      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_DEPLOY_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function checkTokenState() {
  return async (dispatch, getState) => {
    const { safe, token } = getState();

    // Token address already exists
    if (token.address) {
      return;
    }

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    dispatch({
      type: ActionTypes.TOKEN_UPDATE,
    });

    try {
      const address = await getTokenAddress(safe.address);

      if (address === ZERO_ADDRESS) {
        throw new Error('Invalid Token address');
      }

      dispatch({
        type: ActionTypes.TOKEN_UPDATE_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_UPDATE_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
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
      const balance = await getBalance(safe.address, token.address);

      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS,
        meta: {
          balance,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.TOKEN_BALANCE_UPDATE_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}
