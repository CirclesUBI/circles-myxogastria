import update from 'immutability-helper';

import ActionTypes from '~/store/wallet/types';

const initialState = {
  address: null,
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.WALLET_INITIALIZE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
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
