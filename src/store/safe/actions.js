import ActionTypes from '~/store/safe/types';
import core from '~/services/core';
import isDeployed from '~/utils/isDeployed';
import web3 from '~/services/web3';
import { addPendingActivity } from '~/store/activity/actions';
import {
  generateNonce,
  getCurrentAccount,
  getNonce,
  getSafeAddress,
  hasCurrentAccount,
  hasNonce,
  hasSafeAddress,
  removeCurrentAccount,
  removeNonce,
  removeSafeAddress,
  setCurrentAccount,
  setNonce,
  setSafeAddress,
} from '~/services/safe';

const { ActivityTypes } = core.activity;

export function initializeSafe() {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.SAFE_INITIALIZE,
    });

    // Check if we are currently trying to deploy a new Safe. This information
    // about pending Safe deployments is only stored locally in LocalStorage on
    // each device. It indicates that we've finished onboarding but wait for
    // the Safe to be deployed (eg. collecting trust connections).
    const pendingNonce = hasNonce() ? getNonce() : null;
    // If we have a stored pending (predicted) Safe address we apparently
    // finished onboarding and wait now for the Safe to be deployed (for
    // example after collecting all required trust connections).
    const pendingAddress = hasSafeAddress() ? getSafeAddress() : null;

    // Check if there is an deployed, currently selected account stored locally
    // in LocalStorage.
    const currentAccount = hasCurrentAccount() ? getCurrentAccount() : null;

    if (
      (!pendingNonce && pendingAddress) ||
      ((pendingNonce || pendingAddress) && currentAccount)
    ) {
      // Invalid state ..
      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_ERROR,
      });

      throw new Error('Invalid pending Safe state');
    }

    dispatch({
      type: ActionTypes.SAFE_INITIALIZE_SUCCESS,
      meta: {
        currentAccount,
        pendingAddress,
        pendingNonce,
      },
    });
  };
}

export function generateAndStoreNonce() {
  return async (dispatch) => {
    if (hasNonce()) {
      return;
    }

    // Generate and store a new nonce to use it later to predict the future Safe
    // address and prepare onboarding.
    const pendingNonce = generateNonce();
    setNonce(pendingNonce);

    dispatch({
      type: ActionTypes.SAFE_UPDATE_NONCE,
      meta: {
        pendingNonce,
      },
    });
  };
}

export function createSafeWithNonce(pendingNonce) {
  return async (dispatch) => {
    try {
      if (hasSafeAddress()) {
        dispatch({
          type: ActionTypes.SAFE_CREATE_ERROR,
        });

        throw new Error('Invalid state to prepare Safe deployment');
      }

      dispatch({
        type: ActionTypes.SAFE_CREATE,
      });

      // Predict Safe address
      const pendingAddress = await core.safe.prepareDeploy(pendingNonce);

      // Store address when successful
      setSafeAddress(pendingAddress);

      // Store nonce when restoring undeployed Safe
      setNonce(pendingNonce);

      dispatch({
        type: ActionTypes.SAFE_CREATE_SUCCESS,
        meta: {
          pendingAddress,
          pendingNonce,
        },
      });

      return pendingAddress;
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_CREATE_ERROR,
      });

      throw error;
    }
  };
}

export function switchCurrentAccount(address) {
  setCurrentAccount(address);

  return {
    type: ActionTypes.SAFE_SWITCH_ACCOUNT,
    meta: {
      address,
    },
  };
}

export function updateSafeFundedState(isFunded) {
  return {
    type: ActionTypes.SAFE_FUNDED_UPDATE,
    meta: {
      isFunded,
    },
  };
}

export function checkSafeState() {
  return async (dispatch, getState) => {
    const { safe, wallet } = getState();

    // No wallet created yet ..
    if (!wallet.address) {
      return;
    }

    // Waiting to deploy a Safe ..
    if (safe.pendingNonce || safe.pendingAddress) {
      return;
    }

    // Try to find a Safe owned by us
    const safeAddresses = await core.safe.getAddresses(wallet.address);

    if (safeAddresses.length > 0) {
      dispatch({
        type: ActionTypes.SAFE_REMOTE_FOUND,
        meta: {
          safeAddresses,
        },
      });
    }
  };
}

export function deploySafe() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.pendingIsLocked) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_DEPLOY,
    });

    try {
      await core.safe.deploy(safe.pendingAddress);
      await isDeployed(safe.pendingAddress);

      dispatch({
        type: ActionTypes.SAFE_DEPLOY_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_DEPLOY_ERROR,
      });

      throw error;
    }
  };
}

export function finalizeSafeDeployment() {
  return (dispatch, getState) => {
    const { safe } = getState();

    // Clear stored address and nonce which were used for onboarding
    removeSafeAddress();
    removeNonce();

    dispatch({
      type: ActionTypes.SAFE_DEPLOY_FINALIZE,
      meta: {
        address: safe.pendingAddress,
      },
    });
  };
}

export function getSafeOwners() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // Safe is not deployed yet
    if (!safe.currentAccount) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_OWNERS,
    });

    try {
      const owners = await core.safe.getOwners(safe.currentAccount);

      dispatch({
        type: ActionTypes.SAFE_OWNERS_SUCCESS,
        meta: {
          owners,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ERROR,
      });

      throw error;
    }
  };
}

export function addSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    dispatch({
      type: ActionTypes.SAFE_OWNERS_ADD,
    });

    try {
      // Check if wallet already owns a Safe
      const ownerSafeAddresses = await core.safe.getAddresses(address);

      if (ownerSafeAddresses.length > 0) {
        throw new Error('Wallet already owns another Safe');
      }

      // Check if address is a wallet
      if ((await web3.eth.getCode(address)) !== '0x') {
        throw new Error('Address is not an EOA');
      }

      const safeAddress = safe.currentAccount;
      const ownerAddress = address;

      // Add owner to Safe
      const txHash = await core.safe.addOwner(safeAddress, ownerAddress);

      dispatch(
        addPendingActivity({
          txHash,
          type: ActivityTypes.ADD_OWNER,
          data: {
            ownerAddress,
            safeAddress,
          },
        }),
      );

      dispatch({
        type: ActionTypes.SAFE_OWNERS_ADD_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_ADD_ERROR,
      });

      throw error;
    }
  };
}

export function removeSafeOwner(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    dispatch({
      type: ActionTypes.SAFE_OWNERS_REMOVE,
    });

    try {
      const safeAddress = safe.currentAccount;
      const ownerAddress = address;

      const txHash = await core.safe.removeOwner(safeAddress, ownerAddress);

      dispatch(
        addPendingActivity({
          txHash,
          type: ActivityTypes.REMOVE_OWNER,
          data: {
            ownerAddress,
            safeAddress,
          },
        }),
      );

      dispatch({
        type: ActionTypes.SAFE_OWNERS_REMOVE_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_OWNERS_REMOVE_ERROR,
      });

      throw error;
    }
  };
}

export function resetSafe() {
  removeNonce();
  removeSafeAddress();
  removeCurrentAccount();

  return {
    type: ActionTypes.SAFE_RESET,
  };
}
