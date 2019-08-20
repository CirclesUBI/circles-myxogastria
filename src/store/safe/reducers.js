import update from 'immutability-helper';

import ActionTypes from '~/store/safe/types';

const initialState = {
  isLocked: false,
  address: null,
  addressPredicted: null,
  nonce: null,
};

const safeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAFE_INITIALIZE_SUCCESS:
      return update(state, {
        addressPredicted: { $set: action.meta.addressPredicted },
        nonce: { $set: action.meta.nonce },
      });
    case ActionTypes.SAFE_UPDATE:
      return update(state, {
        address: { $set: action.meta.address },
        addressPredicted: { $set: null },
        nonce: { $set: null },
      });
    case ActionTypes.SAFE_DEPLOY:
      return update(state, {
        isLocked: { $set: true },
      });
    case ActionTypes.SAFE_DEPLOY_SUCCESS:
      return update(state, {
        address: { $set: action.meta.address },
        addressPredicted: { $set: null },
        isLocked: { $set: false },
        nonce: { $set: null },
      });
    case ActionTypes.SAFE_DEPLOY_ERROR:
      return update(state, {
        isLocked: { $set: false },
      });
    case ActionTypes.SAFE_RESET:
      return update(state, {
        address: { $set: null },
        addressPredicted: { $set: null },
        isLocked: { $set: false },
        nonce: { $set: null },
      });
    default:
      return state;
  }
};

export default safeReducer;
