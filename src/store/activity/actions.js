import ActionTypes from '~/store/activity/types';
import core from '~/services/core';
import { ZERO_ADDRESS } from '~/utils/constants';
import web3 from '~/services/web3';

import {
  getLastSeen,
  removeLastSeen,
  setLastSeen,
} from '~/services/activities';

export const ONBOARDING_FINALIZATION = Symbol('ONBOARDING_FINALIZATION');

export function initializeActivities() {
  const lastSeen = getLastSeen();

  return {
    type: ActionTypes.ACTIVITIES_INITIALIZE,
    meta: {
      lastSeen,
    },
  };
}

export function updateLastSeen() {
  const lastSeen = Date.now();

  setLastSeen(lastSeen);

  return {
    type: ActionTypes.ACTIVITIES_SET_LAST_SEEN,
    meta: {
      lastSeen,
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

export function removeActivity(id) {
  return {
    type: ActionTypes.ACTIVITIES_REMOVE,
    meta: {
      id,
    },
  };
}

export function resetActivities() {
  removeLastSeen();

  return {
    type: ActionTypes.ACTIVITIES_REMOVE_ALL,
  };
}

export function checkPendingActivities() {
  return async (dispatch, getState) => {
    const state = getState();
    const { activities } = state.activity;

    for (let activity of activities) {
      if (!activity.isPending) {
        continue;
      }

      let isPending;
      let isError;

      // Check special onboarding activity state
      if (activity.type === ONBOARDING_FINALIZATION) {
        const { safeAddress } = activity.data;

        try {
          // Check if both Safe and Token are deployed
          const isSafeDeployed = await web3.eth.getCode(safeAddress);

          const tokenAddress = await core.token.getAddress(safeAddress);
          const isTokenDeployed = tokenAddress !== ZERO_ADDRESS;

          isError = false;
          isPending = !(isSafeDeployed && isTokenDeployed);
        } catch {
          isError = true;
          isPending = true;
        }
      } else {
        // Check normal transaction mining state
        const receipt = await web3.eth.getTransactionReceipt(activity.txHash);

        isPending = receipt === null;
        isError = !isPending && !receipt.status;
      }

      const { id } = activity;

      if (activity.isPending !== isPending || activity.isError !== isError) {
        dispatch({
          type: ActionTypes.ACTIVITIES_SET_STATUS,
          meta: {
            id,
            isError,
            isPending,
          },
        });
      }
    }
  };
}

export function checkFinishedActivities() {
  return async (dispatch, getState) => {
    dispatch({
      type: ActionTypes.ACTIVITIES_UPDATE,
    });

    const { safe, activity } = getState();

    try {
      const { activities, lastTimestamp } = await core.activity.getLatest(
        safe.address,
        activity.lastTimestamp,
      );

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

      return error;
    }
  };
}
