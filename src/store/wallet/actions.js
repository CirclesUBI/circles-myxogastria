import types from '~/store/wallet/types';

import { NOTIFY, NotificationsTypes } from '~/store/notifications/actions';
import { getPublicAddress, removePrivateKey } from '~/services/wallet';
import { predictSafeAddress } from '~/services/safe';

export function initializeWallet() {
  return dispatch => {
    dispatch({
      type: types.WALLET_INITIALIZE,
    });

    try {
      const walletAddress = getPublicAddress();
      const safeAddress = predictSafeAddress(walletAddress);

      dispatch({
        type: types.WALLET_INITIALIZE_SUCCESS,
        meta: {
          safeAddress,
          walletAddress,
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
