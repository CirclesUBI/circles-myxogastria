import ActionTypes from '~/store/activity/types';
import core from '~/services/core';

export function checkActivities() {
  return async (dispatch, getState) => {
    dispatch({
      type: ActionTypes.ACTIVITY_UPDATE,
    });

    const { safe, activity } = getState();

    try {
      const { activities, lastTimestamp } = await core.activity.getLatest(
        safe.address,
        activity.lastTimestamp,
      );

      dispatch({
        type: ActionTypes.ACTIVITY_UPDATE_SUCCESS,
        meta: {
          activities,
          lastTimestamp,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTIVITY_UPDATE_ERROR,
      });

      return error;
    }
  };
}
