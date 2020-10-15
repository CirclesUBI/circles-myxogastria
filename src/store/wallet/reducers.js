import update from 'immutability-helper';

import ActionTypes from '~/store/wallet/types';

const initialState = {
  address: null,
  isKeystoreGiven: false,
  isLocked: true,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.WALLET_INITIALIZE_SUCCESS:
      return update(state, {
        isKeystoreGiven: { $set: action.meta.isKeystoreGiven },
      });
    case ActionTypes.WALLET_UNLOCK_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
      });
    case ActionTypes.WALLET_UNLOCK_FINALIZE:
      return update(state, {
        isLocked: { $set: false },
      });
    case ActionTypes.WALLET_BURN:
      return update(state, {
        address: { $set: null },
      });
    default:
      return state;
  }
};

export default walletReducer;
