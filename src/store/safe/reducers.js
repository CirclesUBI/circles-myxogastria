import update from 'immutability-helper';

import ActionTypes from '~/store/safe/types';

const initialState = {
  accounts: [],
  currentAccount: null,
  isOrganization: false,
  pendingAddress: null,
  pendingIsFunded: false,
  pendingIsLocked: false,
  pendingNonce: null,
  owners: [],
  ownersIsLoading: false,
  safeVersion: null,
};

const safeReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SAFE_INITIALIZE_SUCCESS:
      return update(state, {
        currentAccount: { $set: action.meta.currentAccount },
        isOrganization: { $set: action.meta.isOrganization },
        pendingAddress: { $set: action.meta.pendingAddress },
        pendingNonce: { $set: action.meta.pendingNonce },
        safeVersion: { $set: action.meta.safeVersion },
      });
    case ActionTypes.SAFE_UPDATE_NONCE:
      return update(state, {
        pendingNonce: { $set: action.meta.pendingNonce },
      });
    case ActionTypes.SAFE_FUNDED_UPDATE:
      return update(state, {
        pendingIsFunded: { $set: action.meta.isFunded },
      });
    case ActionTypes.SAFE_CREATE_SUCCESS:
      return update(state, {
        pendingAddress: { $set: action.meta.pendingAddress },
        pendingNonce: { $set: action.meta.pendingNonce },
      });
    case ActionTypes.SAFE_REMOTE_FOUND:
      return update(state, {
        accounts: {
          $push: action.meta.safeAddresses.filter((address) => {
            return !state.accounts.includes(address);
          }),
        },
      });
    case ActionTypes.SAFE_SWITCH_ACCOUNT:
      return update(state, {
        currentAccount: { $set: action.meta.address },
        isOrganization: { $set: action.meta.isOrganization },
      });
    case ActionTypes.SAFE_DEPLOY:
      return update(state, {
        pendingIsLocked: { $set: true },
      });
    case ActionTypes.SAFE_DEPLOY_ERROR:
      return update(state, {
        pendingIsLocked: { $set: false },
      });
    case ActionTypes.SAFE_DEPLOY_FINALIZE:
      return update(state, {
        accounts: {
          $push: [action.meta.address],
        },
        pendingAddress: { $set: null },
        pendingNonce: { $set: null },
      });
    case ActionTypes.SAFE_DEPLOY_UNLOCK:
      return update(state, {
        pendingIsLocked: { $set: false },
      });
    case ActionTypes.SAFE_OWNERS:
      return update(state, {
        ownersIsLoading: { $set: true },
      });
    case ActionTypes.SAFE_OWNERS_SUCCESS:
      return update(state, {
        owners: { $set: action.meta.owners },
        ownersIsLoading: { $set: false },
      });
    case ActionTypes.SAFE_OWNERS_ADD_SUCCESS:
      return update(state, {
        owners: { $push: [action.meta.address] },
        ownersIsLoading: { $set: false },
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
        ownersIsLoading: { $set: false },
      });
    }
    case ActionTypes.SAFE_OWNERS_ERROR:
    case ActionTypes.SAFE_OWNERS_ADD_ERROR:
    case ActionTypes.SAFE_OWNERS_REMOVE_ERROR:
      return update(state, {
        ownersIsLoading: { $set: false },
      });
    case ActionTypes.SAFE_RESET:
      return update(state, { $set: initialState });
    case ActionTypes.SAFE_VERSION_UPDATE_SUCCESS:
      return update(state, {
        safeVersion: { $set: action.meta.version },
      });
    default:
      return state;
  }
};

export default safeReducer;
