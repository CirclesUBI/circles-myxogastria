import notify from '~/store/notifications/actions';
import { checkAppState } from '~/store/app/actions';
import { deployNewSafe, initializeSafeWithNonce } from '~/store/safe/actions';
import { registerUser } from '~/services/core';
import { restoreWallet } from '~/store/wallet/actions';

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

    dispatch(
      notify({
        text: 'Success!', // @TODO: Use i18n
      }),
    );
  };
}

export function restoreAccount(seedPhrase) {
  return async dispatch => {
    await dispatch(restoreWallet(seedPhrase));
    await dispatch(checkAppState());
  };
}
