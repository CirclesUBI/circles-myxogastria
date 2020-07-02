import ActionTypes from '~/store/activity/types';
import core from '~/services/core';
import { ZERO_ADDRESS } from '~/utils/constants';
import web3 from '~/services/web3';

import {
  getLastSeen,
  removeLastSeen,
  setLastSeen,
} from '~/services/activities';

const PAGE_SIZE = 20;

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
    const { activity, safe } = getState();
    const { activities } = activity;

    if (!safe.address) {
      return;
    }

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

function loadActivities(offset = 0) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.address) {
      return;
    }

    dispatch({
      type: ActionTypes.ACTIVITIES_UPDATE,
      meta: {
        offset,
      },
    });

    try {
      const { activities, lastTimestamp } = await core.activity.getLatest(
        safe.address,
        PAGE_SIZE,
        offset,
      );

      dispatch({
        type: ActionTypes.ACTIVITIES_UPDATE_SUCCESS,
        meta: {
          activities,
          lastTimestamp,
          offset,
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

export function loadOlderActivities() {
  return async (dispatch, getState) => {
    const { activity } = getState();
    dispatch(loadActivities(activity.offset + PAGE_SIZE));
  };
}

export function checkFinishedActivities() {
  return loadActivities();
}
