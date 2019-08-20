import ActionTypes from '~/store/wallet/types';

import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';
import { getPublicAddress, fromSeedPhrase } from '~/services/wallet';

function walletError(error) {
  return {
    type: ActionTypes.WALLET_INITIALIZE_ERROR,
    [NOTIFY]: {
      text: error.message,
      type: NotificationsTypes.ERROR,
    },
  };
}

export function initializeWallet() {
  return dispatch => {
    dispatch({
      type: ActionTypes.WALLET_INITIALIZE,
    });

    try {
      const address = getPublicAddress();

      if (address) {
        dispatch({
          type: ActionTypes.WALLET_INITIALIZE_SUCCESS,
          meta: {
            address,
          },
        });
      }
    } catch (error) {
      dispatch(walletError(error));
    }
  };
}

export function restoreWallet(seedPhrase) {
  return dispatch => {
    try {
      fromSeedPhrase(seedPhrase);

      dispatch(initializeWallet());
    } catch (error) {
      dispatch(walletError(error));
    }
  };
}
