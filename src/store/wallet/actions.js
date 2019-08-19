import types from '~/store/wallet/types';

import notify, {
  NOTIFY,
  NotificationsTypes,
} from '~/store/notifications/actions';

import { getPublicAddress, fromSeedPhrase } from '~/services/wallet';

export function initializeWallet() {
  return dispatch => {
    dispatch({
      type: types.WALLET_INITIALIZE,
    });

    try {
      const walletAddress = getPublicAddress();

      if (walletAddress) {
        dispatch({
          type: types.WALLET_INITIALIZE_SUCCESS,
          meta: {
            walletAddress,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: types.WALLET_INITIALIZE_ERROR,
        [NOTIFY]: {
          text: error.message,
          type: NotificationsTypes.ERROR,
        },
      });
    }
  };
}

export function restoreWallet(seedPhrase) {
  return dispatch => {
    try {
      fromSeedPhrase(seedPhrase);
      dispatch(initializeWallet());
    } catch (error) {
      dispatch(
        notify({
          text: error.message,
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };
}
