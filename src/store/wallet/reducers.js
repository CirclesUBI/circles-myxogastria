import update from 'immutability-helper';

import ActionTypes from '~/store/wallet/types';

const initialState = {
  address: undefined,
  isReady: false,
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.WALLET_INITIALIZE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.account.address },
        isReady: { $set: true },
      });
    case ActionTypes.WALLET_INITIALIZE_ERROR:
      return update(state, {
        isReady: { $set: false },
      });
    default:
      return state;
  }
}
