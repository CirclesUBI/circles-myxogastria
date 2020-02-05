import core from '~/services/core';
import web3 from '~/services/web3';
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

const SAFE_FUND_ETHER = '0.002';

// Create a new account which means that we get into
// a pending deployment state. The user has to get 3
// incoming trust connections now or fund its on Safe
// to finally be part of the Circles system.
export function createNewAccount(username, email) {
  return async (dispatch, getState) => {
    try {
      // Create an undeployed Safe
      await dispatch(createSafeWithNonce());
      const { safe } = getState();

      // Register our username
      await core.user.register(safe.nonce, safe.address, username, email);

      // Update our app states
      await dispatch(checkAppState());
      await dispatch(checkAuthState());
    } catch (error) {
      // Roll back in case something went wrong on
      // our way ..
      dispatch(resetSafe());

      throw error;
    }
  };
}

// We want to find out if the Safe and Token can
// be deployed ..
export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { trust, safe } = getState();

    if (!safe.address) {
      return;
    }

    // Check if we have enough funds on the Safe
    const balance = await web3.eth.getBalance(safe.address);

    const isFunded = balance > web3.utils.toWei(SAFE_FUND_ETHER, 'ether');

    // We can attempt an deployment if one of two
    // conditions is met:
    //
    // 1. We have enough incoming trust connections,
    // therefore the Relayer will pay for our fees
    // 2. We funded the Safe ourselves manually
    if (safe.nonce && (trust.isTrusted || isFunded)) {
      await dispatch(finalizeNewAccount());
    }
  };
}

// Finally deploy the Safe and Token for this user!
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

// Recover an account via a seed phrase. We check if we
// can find an deployed Safe related to this
// wallet. Undeployed Safes can not be recovered.
export function restoreAccount(seedPhrase) {
  return async dispatch => {
    await dispatch(restoreWallet(seedPhrase));

    await dispatch(checkAppState());
    await dispatch(checkAuthState());
  };
}
