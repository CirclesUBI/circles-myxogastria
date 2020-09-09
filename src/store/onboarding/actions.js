import core from '~/services/core';
import {
  ONBOARDING_FINALIZATION,
  addPendingActivity,
} from '~/store/activity/actions';
import { checkAppState, checkAuthState } from '~/store/app/actions';
import {
  checkSafeState,
  createSafeWithNonce,
  deploySafe,
  finalizeSafeDeployment,
  switchCurrentAccount,
  updateSafeFundedState,
} from '~/store/safe/actions';
import { deployToken, updateTokenFundedState } from '~/store/token/actions';
import { restoreWallet } from '~/store/wallet/actions';

// Create a new account which means that we get into a pending deployment
// state. The user has to get incoming trust connections now or fund its own
// Safe to finally be part of the Circles system.
export function createNewAccount(username, email, avatarUrl) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    // Create an undeployed Safe
    const pendingAddress = await dispatch(
      createSafeWithNonce(safe.pendingNonce),
    );

    // Register user in on-chain database
    await core.user.register(
      safe.pendingNonce,
      pendingAddress,
      username,
      email,
      avatarUrl,
    );

    // Force updating app state
    await dispatch(checkAppState());
  };
}

// We want to find out if the Safe and Token can be deployed ..
export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.pendingAddress || !safe.pendingNonce) {
      return;
    }

    // Check if we have enough funds for Token / Safe deployment
    const [isSafeFunded, isTokenFunded] = await Promise.all([
      core.safe.isFunded(safe.pendingAddress),
      core.token.isFunded(safe.pendingAddress),
    ]);

    // ... and update the status accordingly
    dispatch(updateSafeFundedState(isSafeFunded));
    dispatch(updateTokenFundedState(isTokenFunded));
  };
}

// Finally deploy the Safe and Token for this user!
export function finalizeNewAccount() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (safe.pendingIsLocked) {
      return;
    }

    // Inform the user about this activity
    dispatch(
      addPendingActivity({
        type: ONBOARDING_FINALIZATION,
        data: {
          safeAddress: safe.pendingAddress,
        },
      }),
    );

    // Deploy Safe and Token
    await dispatch(deploySafe());
    await dispatch(deployToken());

    // Change all states to final
    await dispatch(finalizeSafeDeployment());
    await dispatch(switchCurrentAccount(safe.pendingAddress));

    // Get latest updates
    await dispatch(checkAuthState());
    await dispatch(checkAppState());
  };
}

export function switchAccount(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.accounts.includes(address)) {
      throw new Error('Selected address is not an option');
    }

    await dispatch(switchCurrentAccount(address));
    await dispatch(checkAppState());
  };
}

// Recover an account via a seed phrase. We check if we can find an deployed
// Safe related to this wallet.
export function restoreAccount(seedPhrase, nonce) {
  return async (dispatch, getState) => {
    await dispatch(restoreWallet(seedPhrase));

    if (nonce) {
      await dispatch(createSafeWithNonce(nonce));
    } else {
      await dispatch(checkSafeState());

      const { safe } = getState();
      if (safe.accounts.length > 0) {
        await dispatch(switchCurrentAccount(safe.accounts[0]));
      } else {
        throw new Error('Can not recover undeployed Safe without nonce');
      }
    }

    await dispatch(checkAppState());
  };
}
