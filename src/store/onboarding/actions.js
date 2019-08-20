import { NOTIFY } from '~/store/notifications/actions';
import { checkAppState } from '~/store/app/actions';
import { deployNewSafe, initializeSafeWithNonce } from '~/store/safe/actions';
import { registerUser } from '~/services/core';
import { restoreWallet } from '~/store/wallet/actions';

function welcomeUser() {
  return {
    [NOTIFY]: {
      text: 'Welcome!', // @TODO: Use i18n
    },
  };
}

export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { trust, safe } = getState();

    if (trust.isTrusted && safe.nonce) {
      await dispatch(deployNewSafe());
    }
  };
}

export function createNewAccount(username) {
  return async (dispatch, getState) => {
    const { wallet } = getState();

    await registerUser({
      address: wallet.address,
      username,
    });

    await dispatch(initializeSafeWithNonce());
    dispatch(welcomeUser());
  };
}

export function restoreAccount(seedPhrase) {
  return async (dispatch, getState) => {
    await dispatch(restoreWallet(seedPhrase));
    await dispatch(checkAppState());

    const { safe } = getState();

    if (!safe.address) {
      // Restored wallet does not have deployed Safe yet
      await dispatch(initializeSafeWithNonce());
      dispatch(welcomeUser());
    }
  };
}
