import update from 'immutability-helper';

import ActionTypes from '~/store/token/types';

const initialState = {
  address: null,
  balance: null,
  isLoading: false,
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOKEN_UPDATE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
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
    default:
      return state;
  }
};

export default tokenReducer;
