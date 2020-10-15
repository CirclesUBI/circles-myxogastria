import ActionTypes from '~/store/wallet/types';

import {
  burnWallet as burnWalletInner,
  createWallet as createWalletInner,
  hasWallet,
  unlockWallet as unlockWalletInner,
} from '~/services/wallet';

export function initializeWallet() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WALLET_INITIALIZE,
    });

    try {
      const isKeystoreGiven = hasWallet();

      dispatch({
        type: ActionTypes.WALLET_INITIALIZE_SUCCESS,
        meta: {
          isKeystoreGiven,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.WALLET_INITIALIZE_ERROR,
      });

      throw error;
    }
  };
}

export function createWallet(mnemonic, password) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WALLET_UNLOCK,
    });

    try {
      const address = createWalletInner(mnemonic, password);

      dispatch({
        type: ActionTypes.WALLET_UNLOCK_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.WALLET_UNLOCK_ERROR,
      });

      throw error;
    }
  };
}

export function unlockWallet(password) {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.WALLET_UNLOCK,
    });

    try {
      const address = unlockWalletInner(password);

      dispatch({
        type: ActionTypes.WALLET_UNLOCK_SUCCESS,
        meta: {
          address,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.WALLET_UNLOCK_ERROR,
      });

      throw error;
    }
  };
}

export function unlockWalletFinalize() {
  return {
    type: ActionTypes.WALLET_UNLOCK_FINALIZE,
  };
}

export function burnWallet() {
  burnWalletInner();

  return {
    type: ActionTypes.WALLET_BURN,
  };
}
