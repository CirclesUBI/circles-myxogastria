import update from 'immutability-helper';

import ActionTypes from '~/store/userInputsData/types';

const initialState = {
  username: '',
  avatarUrl: '',
};

const userInputsDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USERINPUTSDATA_USERNAME_UPDATE:
      return update(state, {
        username: { $set: action.meta.username },
      });
    case ActionTypes.USERINPUTSDATA_AVATARURL_UPDATE:
      return update(state, {
        avatarUrl: { $set: action.meta.avatarUrl },
      });
    default:
      return state;
  }
};

export default userInputsDataReducer;
