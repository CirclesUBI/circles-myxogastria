import update from 'immutability-helper';

import ActionTypes from '~/store/activity/types';

const initialState = {
  activities: [],
  isError: false,
  isLoading: false,
  lastTimestamp: 0,
  lastUpdated: 0,
};

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ACTIVITY_UPDATE:
      return update(state, {
        isLoading: { $set: false },
        isError: { $set: false },
        lastUpdated: { $set: Date.now() },
      });
    case ActionTypes.ACTIVITY_UPDATE_SUCCESS:
      return update(state, {
        activities: { $push: action.meta.activities },
        isLoading: { $set: false },
        lastTimestamp: { $set: action.meta.lastTimestamp },
      });
    case ActionTypes.ACTIVITY_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
        isError: { $set: true },
      });
    case ActionTypes.ACTIVITY_REMOVE_ALL:
      return update(state, initialState);
    default:
      return state;
  }
};

export default activityReducer;
