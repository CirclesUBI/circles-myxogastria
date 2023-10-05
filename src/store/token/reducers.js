import update from 'immutability-helper';
import { DateTime } from 'luxon';

import ActionTypes from '~/store/token/types';

const initialState = {
  address: null,
  balance: null,
  isFunded: false,
  isLoading: false,
  lastPayoutAt: null,
  lastUpdateAt: null,
  otherTokens: {
    isLoading: true,
    isError: false,
    otherTokens: [],
  },
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TOKEN_FUNDED_UPDATE:
      return update(state, {
        isFunded: { $set: action.meta.isFunded },
      });
    case ActionTypes.TOKEN_UPDATE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        lastPayoutAt: { $set: action.meta.lastPayoutAt },
      });
    case ActionTypes.TOKEN_UPDATE_OTHER_TOKENS:
      return update(state, {
        otherTokens: {
          otherTokens: { $set: action.meta.otherTokens },
        },
      });
    case ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_LOADING:
      return update(state, {
        otherTokens: {
          isLoading: { $set: action.meta.isLoading },
        },
      });
    case ActionTypes.TOKEN_UPDATE_OTHER_TOKENS_ERROR:
      return update(state, {
        otherTokens: {
          isError: { $set: action.meta.isError },
        },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_SUCCESS:
      return update(state, {
        balance: { $set: action.meta.balance },
        isLoading: { $set: false },
        lastUpdatedAt: { $set: DateTime.local().toISO() },
      });
    case ActionTypes.TOKEN_BALANCE_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
      });
    case ActionTypes.TOKEN_UBI_PAYOUT_SUCCESS:
      return update(state, {
        lastPayoutAt: { $set: action.meta.lastPayoutAt },
      });
    case ActionTypes.TOKEN_RESET:
      return update(state, { $set: initialState });
    default:
      return state;
  }
};

export default tokenReducer;
