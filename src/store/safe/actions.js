import ActionTypes from '~/store/safe/types';

import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';
import { hasNonce, generateNonce, setNonce, getNonce } from '~/services/nonce';

import {
  deploySafe,
  getSafeAddress,
  predictSafeAddress,
} from '~/services/core';

export function initializeSafe() {
  return (dispatch, getState) => {
    try {
      if (!hasNonce()) {
        return;
      }

      dispatch({
        type: ActionTypes.SAFE_INITIALIZE,
      });

      const { wallet } = getState();
      const nonce = getNonce();
      const addressPredicted = predictSafeAddress(wallet.address, nonce);

      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_SUCCESS,
        meta: {
          addressPredicted,
          nonce,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_ERROR,
        [NOTIFY]: {
          text: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function checkSafeState() {
  return async (dispatch, getState) => {
    const { wallet, safe } = getState();

    if (!safe.address) {
      const address = await getSafeAddress(wallet.address);

      if (address) {
        dispatch({
          type: ActionTypes.SAFE_UPDATE,
          meta: {
            address,
          },
        });
      }
    }
  };
}

export function initializeSafeWithNonce() {
  return dispatch => {
    if (hasNonce()) {
      return;
    }

    const nonce = generateNonce();
    setNonce(nonce);

    dispatch(initializeSafe());
  };
}

export function deployNewSafe() {
  return async (dispatch, getState) => {
    const { wallet, safe } = getState();

    if (safe.isLocked) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_DEPLOY,
    });

    try {
      const address = await deploySafe(wallet.address, safe.nonce);

      dispatch({
        type: ActionTypes.SAFE_DEPLOY_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_DEPLOY_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}
