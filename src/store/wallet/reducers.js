import update from 'immutability-helper';

import ActionTypes from '~/store/wallet/types';

const initialState = {
  isReady: false,
  safeAddress: undefined,
  walletAddress: undefined,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.WALLET_INITIALIZE_SUCCESS:
      return update(state, {
        walletAddress: { $set: action.meta.walletAddress },
      });
    case ActionTypes.WALLET_INITIALIZE_ERROR:
      return update(state, {
        isReady: { $set: false },
      });
    default:
      return state;
  }
};

export default walletReducer;
