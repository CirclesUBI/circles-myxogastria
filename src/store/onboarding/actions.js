import core from '~/services/core';
import { checkAppState, checkAuthState } from '~/store/app/actions';
import { deployToken } from '~/store/token/actions';
import { restoreWallet } from '~/store/wallet/actions';

import {
  deploySafe,
  createSafeWithNonce,
  resetSafe,
} from '~/store/safe/actions';

export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { trust, safe } = getState();

    // @TODO: We could check the error state here where no nonce is given but also no Safe is deployed yet
    if (trust.isTrusted && safe.nonce) {
      await finalizeNewAccount();
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
  return async dispatch => {
    await dispatch(deploySafe());
    await dispatch(deployToken());
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
