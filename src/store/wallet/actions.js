import ActionTypes from '~/store/wallet/types';
import core from '~/services/core';

import {
  fromSeedPhrase,
  getPublicAddress,
  removePrivateKey,
} from '~/services/wallet';

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
      dispatch({
        type: ActionTypes.WALLET_INITIALIZE_ERROR,
      });

      throw error;
    }
  };
}

export function restoreWallet(seedPhrase) {
  return async dispatch => {
    const address = fromSeedPhrase(seedPhrase);

    const safeAddress = await core.safe.getAddress(address);

    if (!safeAddress) {
      throw new Error('Can not restore undeployed Safe');
    }

    dispatch(initializeWallet());
  };
}

export function burnWallet() {
  removePrivateKey();

  return {
    type: ActionTypes.WALLET_BURN,
  };
}
