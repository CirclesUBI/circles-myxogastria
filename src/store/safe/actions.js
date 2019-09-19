import ActionTypes from '~/store/safe/types';
import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';

import {
  generateNonce,
  getNonce,
  getSafeAddress,
  hasNonce,
  hasSafeAddress,
  removeNonce,
  removeSafeAddress,
  setNonce,
  setSafeAddress,
} from '~/services/safe';

import { deploySafe, prepareSafeDeploy } from '~/services/core';

export function initializeSafe() {
  const nonce = hasNonce() ? getNonce() : null;
  const address = hasSafeAddress() ? getSafeAddress() : null;

  return {
    type: ActionTypes.SAFE_UPDATE,
    meta: {
      address,
      nonce,
    },
  };
}

export function createSafeWithNonce() {
  return async dispatch => {
    try {
      if (hasNonce()) {
        return;
      }

      dispatch({
        type: ActionTypes.SAFE_CREATE,
      });

      // Generate a salt nonce
      const nonce = generateNonce();
      setNonce(nonce);

      // Predict Safe address
      const address = await prepareSafeDeploy(nonce);
      setSafeAddress(address);

      dispatch({
        type: ActionTypes.SAFE_CREATE_SUCCESS,
        meta: {
          address,
          nonce,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_CREATE_ERROR,
        [NOTIFY]: {
          text: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function checkSafeState() {
  // @TODO: Check if address is owner of Safe
  // eslint-disable-next-line no-unused-vars
  return dispatch => {};
}

export function deployNewSafe() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.isLocked) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_DEPLOY,
    });

    try {
      await deploySafe(safe.address);

      dispatch({
        type: ActionTypes.SAFE_DEPLOY_SUCCESS,
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

export function resetSafe() {
  removeNonce();
  removeSafeAddress();

  return {
    type: ActionTypes.SAFE_RESET,
  };
}
