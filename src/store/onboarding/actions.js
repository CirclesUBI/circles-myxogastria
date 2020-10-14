import core from '~/services/core';
import web3 from '~/services/web3';
import {
  RESTORE_ACCOUNT_INVALID_SEED_PHRASE,
  RESTORE_ACCOUNT_UNKNOWN_SAFE,
} from '~/utils/errors';
import { checkAppState } from '~/store/app/actions';
import {
  checkSharedSafeState,
  createSafeWithNonce,
  deploySafe,
  deploySafeForOrganization,
  finalizeSafeDeployment,
  recreateUndeployedSafe,
  switchCurrentAccount,
  unlockSafeDeployment,
  updateSafeFundedState,
} from '~/store/safe/actions';
import { deployToken, updateTokenFundedState } from '~/store/token/actions';
import { generateDeterministicNonce } from '~/services/safe';
import {
  hideSpinnerOverlay,
  showSpinnerOverlay,
  switchAccount,
} from '~/store/app/actions';
import { isOrganization } from '~/utils/isDeployed';
import { restoreWallet } from '~/store/wallet/actions';

// Create a new account which means that we get into a pending deployment
// state. The user has to get incoming trust connections now or fund its own
// Safe to finally be part of the Circles system.
export function createNewAccount(username, email, avatarUrl) {
  return async (dispatch, getState) => {
    const { wallet } = getState();

    // Create an undeployed Safe
    const pendingNonce = generateDeterministicNonce(wallet.address);
    const pendingAddress = await dispatch(createSafeWithNonce(pendingNonce));

    // Register user in on-chain database
    await core.user.register(
      pendingNonce,
      pendingAddress,
      username,
      email,
      avatarUrl,
    );

    // Force updating app state
    await dispatch(checkAppState());
  };
}

// Create a new organization account (aka shared wallet) when user is already
// verified.
export function createNewOrganization(
  name,
  email,
  avatarUrl,
  prefundValue = 1,
) {
  return async (dispatch, getState) => {
    try {
      const { safe } = getState();
      const creatorSafeAddress = safe.currentAccount;

      dispatch(showSpinnerOverlay());

      // Create an undeployed Safe for organizations (so far this is the same
      // flow as regular user accounts)
      const nonce = Date.now();
      const safeAddress = await core.safe.prepareDeploy(nonce);

      // Register organization in on-chain database
      await core.user.register(nonce, safeAddress, name, email, avatarUrl);

      // Deploy the safe directly as we don't have to wait for any trust limit
      // etc. validation (the user is already trusted, therefore we also trust
      // its organization)
      dispatch(hideSpinnerOverlay());
      await dispatch(deploySafeForOrganization(safeAddress));

      // Create the organization account in the Hub
      await core.organization.deploy(safeAddress);
      await isOrganization(safeAddress);

      // Prefund the organization with Tokens from the user
      await core.organization.prefund(
        creatorSafeAddress,
        safeAddress,
        web3.utils.toBN(web3.utils.toWei(prefundValue.toString(), 'ether')),
      );

      // Switch to newly created organization acccount
      await dispatch(switchAccount(safeAddress));

      // Force updating app state
      await dispatch(checkAppState());

      // Finally unlock the Safe (enable UI again)
      await dispatch(unlockSafeDeployment());
    } catch (error) {
      dispatch(hideSpinnerOverlay());
      throw error;
    }
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

    // Deploy Safe and Token
    await dispatch(deploySafe());
    await dispatch(deployToken());

    // Change all states to final
    await dispatch(finalizeSafeDeployment());
    await dispatch(switchAccount(safe.pendingAddress));

    // Finally unlock the Safe (enable UI again)
    await dispatch(unlockSafeDeployment());
  };
}

// Recover an account via a seed phrase. We check if we can find an deployed
// Safe related to this wallet.
export function restoreAccount(seedPhrase) {
  return async (dispatch, getState) => {
    try {
      await dispatch(restoreWallet(seedPhrase));
    } catch {
      throw new Error(RESTORE_ACCOUNT_INVALID_SEED_PHRASE);
    }

    // Find out if Safe is already deployed and has recovered address as an
    // owner
    await dispatch(checkSharedSafeState());
    const { safe } = getState();
    if (safe.accounts.length > 0) {
      // Found deployed account, switch to first one
      await dispatch(switchCurrentAccount(safe.accounts[0]));
    } else {
      // Could not find deployed Safe, try to recover it
      try {
        await dispatch(recreateUndeployedSafe());
      } catch {
        throw new Error(RESTORE_ACCOUNT_UNKNOWN_SAFE);
      }
    }

    await dispatch(checkAppState());
  };
}
