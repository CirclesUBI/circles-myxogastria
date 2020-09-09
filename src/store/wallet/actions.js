import ActionTypes from '~/store/wallet/types';

import {
  fromSeedPhrase,
  getPublicAddress,
  removePrivateKey,
} from '~/services/wallet';

export function initializeWallet() {
  return (dispatch) => {
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
      dispatch({
        type: ActionTypes.WALLET_INITIALIZE_ERROR,
      });

      throw error;
    }
  };
}

export function restoreWallet(seedPhrase) {
  return async (dispatch) => {
    fromSeedPhrase(seedPhrase);
    dispatch(initializeWallet());
  };
}

export function burnWallet() {
  removePrivateKey();

  return {
    type: ActionTypes.WALLET_BURN,
  };
}
