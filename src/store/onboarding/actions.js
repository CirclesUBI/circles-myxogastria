import core from '~/services/core';
import { checkAppState, checkAuthState } from '~/store/app/actions';
import { deployToken } from '~/store/token/actions';
import { restoreWallet } from '~/store/wallet/actions';

import {
  ONBOARDING_FINALIZATION,
  addPendingActivity,
} from '~/store/activity/actions';

import {
  createSafeWithNonce,
  deploySafe,
  finalizeSafeDeployment,
  resetSafe,
} from '~/store/safe/actions';

export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { trust, safe } = getState();

    // Safe is not deployed yet, check if we can do it
    if (trust.isTrusted && safe.nonce) {
      await dispatch(finalizeNewAccount());
    }
  };
}

export function createNewAccount(username) {
  return async (dispatch, getState) => {
    try {
      await dispatch(createSafeWithNonce());
      const { safe } = getState();
      await core.user.register(safe.nonce, safe.address, username);
      await dispatch(checkAppState());
      await dispatch(checkAuthState());
    } catch (error) {
      dispatch(resetSafe());

      throw error;
    }
  };
}

export function finalizeNewAccount() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.isLocked) {
      return;
    }

    // Inform the user about this activity
    dispatch(
      addPendingActivity({
        type: ONBOARDING_FINALIZATION,
        data: {
          safeAddress: safe.address,
        },
      }),
    );

    // Deploy Safe and Token
    await dispatch(deploySafe());
    await dispatch(deployToken());

    // Change all states to final
    await dispatch(finalizeSafeDeployment());

    // Get latest updates
    await dispatch(checkAppState());
  };
}

export function restoreAccount(seedPhrase) {
  return async dispatch => {
    await dispatch(restoreWallet(seedPhrase));
    await dispatch(checkAppState());
    await dispatch(checkAuthState());
  };
}
