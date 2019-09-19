import notify from '~/store/notifications/actions';
import { checkAppState } from '~/store/app/actions';
import { deployNewSafe, createSafeWithNonce } from '~/store/safe/actions';
import { registerUser } from '~/services/core';
import { removeNonce } from '~/services/safe';
import { restoreWallet } from '~/store/wallet/actions';

function welcomeUser() {
  return notify({
    text: 'Welcome!', // @TODO: Use i18n
  });
}

export function checkOnboardingState() {
  return async (dispatch, getState) => {
    const { trust, safe } = getState();

    // @TODO: We could check the error state here where no nonce is given but also no Safe is deployed yet
    if (trust.isTrusted && safe.nonce) {
      await dispatch(deployNewSafe());
      removeNonce();
    }
  };
}

export function createNewAccount(username) {
  return async (dispatch, getState) => {
    await dispatch(createSafeWithNonce());

    const { safe } = getState();

    await registerUser(safe.nonce, safe.address, username);

    dispatch(welcomeUser());
  };
}

export function restoreAccount(seedPhrase) {
  return async dispatch => {
    await dispatch(restoreWallet(seedPhrase));
    await dispatch(checkAppState());
  };
}
