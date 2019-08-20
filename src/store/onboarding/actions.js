import notify from '~/store/notifications/actions';
import { deployNewSafe, initializeSafeWithNonce } from '~/store/safe/actions';
import { registerUser } from '~/services/core';

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
