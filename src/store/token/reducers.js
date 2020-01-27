import update from 'immutability-helper';

import ActionTypes from '~/store/token/types';

const initialState = {
  address: null,
  balance: null,
  isLoading: false,
  isPayoutChecked: false,
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOKEN_UPDATE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        isPayoutChecked: { $set: false },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS:
      return update(state, {
        balance: { $set: action.meta.balance },
        isLoading: { $set: false },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
      });
    case ActionTypes.TOKEN_UBI_PAYOUT_SUCCESS:
    case ActionTypes.TOKEN_UBI_PAYOUT_ERROR:
      return update(state, {
        isPayoutChecked: { $set: true },
      });
    case ActionTypes.TOKEN_RESET:
      return update(state, { $set: initialState });
    default:
      return state;
  }
};

export default tokenReducer;
