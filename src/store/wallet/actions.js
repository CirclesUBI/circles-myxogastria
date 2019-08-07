import types from '~/store/wallet/types';

import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';
import { initializeAccount, removePrivateKey } from '~/services/wallet';

export function initializeWallet() {
  return dispatch => {
    dispatch({
      type: types.WALLET_INITIALIZE,
    });

    try {
      const account = initializeAccount();

      dispatch({
        type: types.WALLET_INITIALIZE_SUCCESS,
        meta: {
          account,
        },
      });
    } catch (error) {
      removePrivateKey();

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
