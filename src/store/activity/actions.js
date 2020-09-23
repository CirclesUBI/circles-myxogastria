import { DateTime } from 'luxon';

import ActionTypes from '~/store/activity/types';
import core from '~/services/core';
import web3 from '~/services/web3';
import { checkCurrentBalance } from '~/store/token/actions';
import { getLastSeen, removeLastSeen, setLastSeen } from '~/services/activity';

const { ActivityTypes } = core.activity;

const PAGE_SIZE = 20;

export function initializeActivities() {
  const lastSeenAt = getLastSeen();

  return {
    type: ActionTypes.ACTIVITIES_INITIALIZE,
    meta: {
      lastSeenAt,
    },
  };
}

export function updateLastSeen() {
  const lastSeenAt = DateTime.local().toISO();

  setLastSeen(lastSeenAt);

  return {
    type: ActionTypes.ACTIVITIES_SET_LAST_SEEN,
    meta: {
      lastSeenAt,
    },
  };
}

export function addPendingActivity({ txHash, type, data }) {
  return {
    type: ActionTypes.ACTIVITIES_ADD,
    meta: {
      data,
      txHash,
      type,
    },
  };
}

export function checkPendingActivities() {
  return async (dispatch, getState) => {
    const { activity, safe } = getState();
    const { activities } = activity;

    if (!safe.currentAccount) {
      return;
    }

    for (let activity of activities) {
      if (!activity.isPending) {
        continue;
      }

      let isError;

      // Check transaction mining state
      const receipt = await web3.eth.getTransactionReceipt(activity.txHash);
      isError = receipt === null && !receipt.status;

      if (activity.isError !== isError) {
        dispatch({
          type: ActionTypes.ACTIVITIES_SET_STATUS,
          meta: {
            hash: activity.hash,
            isError,
            isPending: true,
          },
        });
      }
    }
  };
}

function loadActivities() {
  return async (dispatch, getState) => {
    const { safe, activity } = getState();

    if (!safe.currentAccount) {
      return;
    }

    dispatch({
      type: ActionTypes.ACTIVITIES_UPDATE,
    });

    try {
      const { activities, lastTimestamp } = await core.activity.getLatest(
        safe.currentAccount,
        PAGE_SIZE,
        activity.lastTimestamp,
      );

      // Force checking current balance when there is new incoming transfer
      // events
      if (
        activities.type === ActivityTypes.TRANSFER ||
        activities.type === ActivityTypes.HUB_TRANSFER
      ) {
        await dispatch(checkCurrentBalance());
      }

      dispatch({
        type: ActionTypes.ACTIVITIES_UPDATE_SUCCESS,
        meta: {
          activities,
          lastTimestamp,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTIVITIES_UPDATE_ERROR,
      });
    }
  };
}

export function loadMoreActivities() {
  return async (dispatch, getState) => {
    const { safe, activity } = getState();

    if (!safe.currentAccount) {
      return;
    }

    dispatch({
      type: ActionTypes.ACTIVITIES_LOAD_MORE,
    });

    const offset = activity.offset + PAGE_SIZE;

    try {
      const { activities } = await core.activity.getLatest(
        safe.currentAccount,
        PAGE_SIZE,
        0,
        offset,
      );

      dispatch({
        type: ActionTypes.ACTIVITIES_LOAD_MORE_SUCCESS,
        meta: {
          activities,
          offset,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.ACTIVITIES_LOAD_MORE_ERROR,
      });
    }
  };
}

export function checkFinishedActivities() {
  return loadActivities();
}

export function resetActivities() {
  removeLastSeen();

  return {
    type: ActionTypes.ACTIVITIES_RESET,
  };
}
