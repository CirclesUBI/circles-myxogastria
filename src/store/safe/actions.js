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

import {
  addOwner,
  deploySafe,
  getOwners,
  prepareSafeDeploy,
  removeOwner,
} from '~/services/core';

export function initializeSafe() {
  return async dispatch => {
    dispatch({
      type: ActionTypes.SAFE_INITIALIZE,
    });

    const nonce = hasNonce() ? getNonce() : null;
    const address = hasSafeAddress() ? getSafeAddress() : null;

    if (nonce && !address) {
      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_ERROR,
        [NOTIFY]: {
          text: 'Invalid safe state', // @TODO
          type: NotificationsTypes.ERROR,
        },
      });

      return;
    }

    dispatch({
      type: ActionTypes.SAFE_UPDATE,
      meta: {
        address,
        nonce,
      },
    });
  };
}

export function createSafeWithNonce() {
  return async dispatch => {
    try {
      if (hasNonce()) {
        dispatch({
          type: ActionTypes.SAFE_CREATE_ERROR,
          [NOTIFY]: {
            text: 'Nonce already given', // @TODO
            type: NotificationsTypes.ERROR,
          },
        });

        return;
      }

      dispatch({
        type: ActionTypes.SAFE_CREATE,
      });

      // Generate a salt nonce
      const nonce = generateNonce();

      // Predict Safe address
      const address = await prepareSafeDeploy(nonce);

      // Store them when successful
      setSafeAddress(address);
      setNonce(nonce);

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
          text: error.message, // @TODO
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

export function getSafeOwners() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // Safe is not deployed yet
    if (safe.nonce) {
      return;
    }

    try {
      const owners = await getOwners(safe.address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_UPDATE,
        meta: {
          owners,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function addSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    try {
      await addOwner(safe.address, address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_SUCCESS_ADD,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ERROR,
        [NOTIFY]: {
          message: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function removeSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    try {
      await removeOwner(safe.address, address);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_SUCCESS_REMOVE,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ERROR,
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
