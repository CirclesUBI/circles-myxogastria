import update from 'immutability-helper';

import ActionTypes from '~/store/app/types';

const initialState = {
  isReady: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.APP_INITIALIZE:
      return update(state, {
        isReady: { $set: false },
      });
    case ActionTypes.APP_INITIALIZE_READY:
      return update(state, {
        isReady: { $set: true },
      });
    default:
      return state;
  }
};

export default appReducer;
