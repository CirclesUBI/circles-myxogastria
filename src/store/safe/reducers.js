import update from 'immutability-helper';

import ActionTypes from '~/store/safe/types';

const initialState = {
  address: null,
  isLoading: false,
  isLocked: false,
  nonce: null,
  owners: [],
};

const safeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAFE_INITIALIZE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        nonce: { $set: action.meta.nonce },
      });
    case ActionTypes.SAFE_CREATE_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        nonce: { $set: action.meta.nonce },
      });
    case ActionTypes.SAFE_REMOTE_FOUND:
      return update(state, {
        address: { $set: action.meta.address },
      });
    case ActionTypes.SAFE_REMOTE_REMOVED:
      return update(state, {
        address: { $set: initialState.address },
      });
    case ActionTypes.SAFE_DEPLOY:
      return update(state, {
        isLocked: { $set: true },
      });
    case ActionTypes.SAFE_DEPLOY_ERROR:
      return update(state, {
        isLocked: { $set: false },
      });
    case ActionTypes.SAFE_DEPLOY_FINALIZE:
      return update(state, {
        isLocked: { $set: false },
        nonce: { $set: null },
      });
    case ActionTypes.SAFE_OWNERS:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.SAFE_OWNERS_SUCCESS:
      return update(state, {
        owners: { $set: action.meta.owners },
        isLoading: { $set: false },
      });
    case ActionTypes.SAFE_OWNERS_ADD_SUCCESS:
      return update(state, {
        owners: { $push: [action.meta.address] },
        isLoading: { $set: false },
      });
    case ActionTypes.SAFE_OWNERS_REMOVE_SUCCESS: {
      const index = state.owners.findIndex((address) => {
        return address === action.meta.address;
      });

      if (index === -1) {
        return state;
      }

      return update(state, {
        owners: { $splice: [[index, 1]] },
        isLoading: { $set: false },
      });
    }
    case ActionTypes.SAFE_OWNERS_ERROR:
    case ActionTypes.SAFE_OWNERS_ADD_ERROR:
    case ActionTypes.SAFE_OWNERS_REMOVE_ERROR:
      return update(state, {
        isLoading: { $set: false },
      });
    case ActionTypes.SAFE_RESET:
      return update(state, { $set: initialState });
    default:
      return state;
  }
};

export default safeReducer;
