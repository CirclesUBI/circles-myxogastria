import update from 'immutability-helper';

import ActionTypes from '~/store/user/types';

const initialState = {
  isMigrationAccepted: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USER_MIGRATION_UPDATE:
      return update(state, {
        isMigrationAccepted: { $set: action.meta.isMigrationAccepted },
      });
    default:
      return state;
  }
};

export default userReducer;
