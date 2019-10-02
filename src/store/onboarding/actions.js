import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { checkAppState } from '~/store/app/actions';
import { deployNewToken } from '~/store/token/actions';
import { registerUser } from '~/services/core';
import { restoreWallet } from '~/store/wallet/actions';

import {
  deployNewSafe,
  createSafeWithNonce,
  resetSafe,
} from '~/store/safe/actions';

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
      await finalizeNewAccount();
    }
  };
}

export function createNewAccount(username) {
  return async (dispatch, getState) => {
    try {
      await dispatch(createSafeWithNonce());
      const { safe } = getState();
      await registerUser(safe.nonce, safe.address, username);
      await dispatch(welcomeUser());
    } catch (error) {
      dispatch(resetSafe());

      dispatch(
        notify({
          text: error.message, // @TODO
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };
}

export function finalizeNewAccount() {
  return async dispatch => {
    await dispatch(deployNewSafe());
    await dispatch(deployNewToken());
  };
}

export function restoreAccount(seedPhrase) {
  return async dispatch => {
    await dispatch(restoreWallet(seedPhrase));
    await dispatch(checkAppState());
  };
}
