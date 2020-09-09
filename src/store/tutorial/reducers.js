import update from 'immutability-helper';

import ActionTypes from '~/store/tutorial/types';

const initialState = {};

const tutorialReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.TUTORIAL_UPDATE:
      return update(state, {
        [action.meta.name]: { $set: { isFinished: action.meta.isFinished } },
      });
    default:
      return state;
  }
};

export default tutorialReducer;
