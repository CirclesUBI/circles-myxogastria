import core from '~/services/core';
import {
  generateDeterministicNonce,
  getCurrentAccount,
  getNonce,
  getSafeAddress,
  getSafeVersion,
  hasCurrentAccount,
  hasNonce,
  hasSafeAddress,
  hasSafeVersion,
  removeCurrentAccount,
  removeNonce,
  removeSafeAddress,
  setCurrentAccount,
  setNonce,
  setSafeAddress,
  setSafeVersion,
} from '~/services/safe';
import web3 from '~/services/web3';
import ActionTypes from '~/store/safe/types';
import { SAFE_LAST_VERSION } from '~/utils/constants';
import { isDeployed, waitAndRetryOnFail } from '~/utils/stateChecks';

export function initializeSafe() {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.SAFE_INITIALIZE,
    });

    // Check if we are currently trying to deploy a new Safe. This information
    // about pending Safe deployments is only stored locally in LocalStorage on
    // each device. It indicates that we've finished onboarding but wait for
    // the Safe to be deployed (eg. collecting trust connections).
    let pendingNonce = hasNonce() ? getNonce() : null;
    // If we have a stored pending (predicted) Safe address we apparently
    // finished onboarding and wait now for the Safe to be deployed (for
    // example after collecting all required trust connections).
    let pendingAddress = hasSafeAddress() ? getSafeAddress() : null;

    // Check if there is an deployed, currently selected account stored locally
    // in LocalStorage.
    let currentAccount = hasCurrentAccount() ? getCurrentAccount() : null;

    if (
      (!pendingNonce && pendingAddress) ||
      ((pendingNonce || pendingAddress) && currentAccount)
    ) {
      // Invalid state ..
      dispatch({
        type: ActionTypes.SAFE_INITIALIZE_ERROR,
      });

      throw new Error(
        `Invalid pending Safe state: ${[
          pendingNonce,
          pendingAddress,
          currentAccount,
        ].join(', ')}`,
      );
    }

    // If there is a stored current account address we check if its an
    // organization, otherwise it must be a user account which is waiting to be
    // deployed
    const isOrganization = currentAccount
      ? await core.organization.isOrganization(currentAccount)
      : false;

    const safeVersion = hasSafeVersion() ? getSafeVersion() : null;

    dispatch({
      type: ActionTypes.SAFE_INITIALIZE_SUCCESS,
      meta: {
        currentAccount,
        isOrganization,
        pendingAddress,
        pendingNonce,
        safeVersion,
      },
    });
  };
}

export function recreateUndeployedSafe() {
  return async (dispatch, getState) => {
    try {
      if (hasSafeAddress()) {
        dispatch({
          type: ActionTypes.SAFE_CREATE_ERROR,
        });

        throw new Error('Invalid state to prepare Safe deployment');
      }

      const { wallet } = getState();

      // Try to predict safe address via deterministic nonce. This action does
      // NOT create a Safe!
      const pendingNonce = generateDeterministicNonce(wallet.address);
      const pendingAddress = await core.safe.predictAddress(pendingNonce);

      // Check if precicted address exists in our system (it should be created,
      // but not deployed yet).
      const status = await core.safe.getSafeStatus(pendingAddress);
      if (!status.isCreated) {
        // This Safe is not know to the relayer (something must have went wrong
        // there), register it!
        await core.safe.prepareDeploy(pendingNonce);
      }

      dispatch({
        type: ActionTypes.SAFE_CREATE,
      });

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
  return async (dispatch) => {
    const isOrganization = await core.organization.isOrganization(address);

    setCurrentAccount(address);

    dispatch({
      type: ActionTypes.SAFE_SWITCH_ACCOUNT,
      meta: {
        address,
        isOrganization,
      },
    });
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

export function checkSharedSafeState() {
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
      await waitAndRetryOnFail(
        async () => {
          return await core.safe.deploy(safe.pendingAddress);
        },
        async () => {
          return await isDeployed(safe.pendingAddress);
        },
      );

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

export function deploySafeForOrganization(safeAddress) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.pendingIsLocked) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_DEPLOY,
    });

    try {
      await waitAndRetryOnFail(
        async () => {
          return await core.safe.deployForOrganization(safeAddress);
        },
        async () => {
          return await isDeployed(safeAddress);
        },
      );

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

export function unlockSafeDeployment() {
  return {
    type: ActionTypes.SAFE_DEPLOY_UNLOCK,
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
      // Check if address is a wallet
      if ((await web3.eth.getCode(address)) !== '0x') {
        throw new Error('Address is not an EOA');
      }

      const safeAddress = safe.currentAccount;
      const ownerAddress = address;

      // Add owner to Safe
      await core.safe.addOwner(safeAddress, ownerAddress);

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

      await core.safe.removeOwner(safeAddress, ownerAddress);

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

export function updateSafeVersion() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // No safe address given yet
    if (!safe.currentAccount) {
      return;
    }

    // TODO: this would go in another place
    if (safe.safeVersion && safe.safeVersion === SAFE_LAST_VERSION) {
      return;
    }

    dispatch({
      type: ActionTypes.SAFE_VERSION_UPDATE,
    });

    try {
      await core.token.updateToLastVersion(safe.currentAccount);

      const version = core.token.getVersion(safe.currentAccount);
      setSafeVersion(version);

      dispatch({
        type: ActionTypes.SAFE_VERSION_UPDATE_SUCCESS,
        meta: {
          version,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.SAFE_VERSION_UPDATE_ERROR,
      });

      throw error;
    }
  };
}
