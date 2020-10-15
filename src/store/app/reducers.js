import update from 'immutability-helper';

import ActionTypes from '~/store/app/types';

const initialState = {
  errorMessage: '',
  isAuthorized: false,
  isConnected: false,
  isError: false,
  isErrorCritical: false,
  isLoading: false,
  isReady: false,
  isValidated: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.APP_INITIALIZE:
      return update(state, {
        isReady: { $set: false },
      });
    case ActionTypes.APP_INITIALIZE_SUCCESS:
      return update(state, {
        isReady: { $set: true },
      });
    case ActionTypes.APP_INITIALIZE_ERROR:
      return update(state, {
        errorMessage: { $set: action.meta.errorMessage },
        isError: { $set: true },
        isErrorCritical: { $set: action.meta.isCritical },
      });
    case ActionTypes.APP_CONNECT_SUCCESS:
      return update(state, {
        isConnected: { $set: true },
      });
    case ActionTypes.APP_CONNECT_ERROR:
      return update(state, {
        isConnected: { $set: false },
      });
    case ActionTypes.APP_SPINNER_SHOW:
      return update(state, {
        isLoading: { $set: true },
      });
    case ActionTypes.APP_SPINNER_HIDE:
      return update(state, {
        isLoading: { $set: false },
      });
    case ActionTypes.APP_UPDATE_AUTH:
      return update(state, {
        isAuthorized: { $set: action.meta.isAuthorized },
        isValidated: { $set: action.meta.isValidated },
      });
    default:
      return state;
  }
};

export default appReducer;
