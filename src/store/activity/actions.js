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

      let isPending;
      let isError;

      // Check special onboarding activity state
      if (activity.type === ONBOARDING_FINALIZATION) {
        const { safeAddress } = activity.data;

        try {
          // Check if both Safe and Token are deployed
          const isSafeDeployed = (await web3.eth.getCode(safeAddress)) !== '0x';
          const isTokenDeployed =
            (await core.token.getAddress(safeAddress)) !== ZERO_ADDRESS;

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

      const { hash } = activity;

      if (activity.isPending !== isPending || activity.isError !== isError) {
        dispatch({
          type: ActionTypes.ACTIVITIES_SET_STATUS,
          meta: {
            hash,
            isError,
            isPending,
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
