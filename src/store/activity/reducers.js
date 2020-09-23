import update from 'immutability-helper';
import { DateTime } from 'luxon';

import ActionTypes from '~/store/activity/types';
import web3 from '~/services/web3';

// Every item in the activities list has an unique hash identifier
function generateHash(activity) {
  const value = `${activity.txHash}${activity.type.toString()}`;
  return web3.utils.sha3(value);
}

const initialState = {
  activities: [],
  isError: false,
  isLoading: false,
  isLoadingMore: false,
  isMoreAvailable: true,
  lastSeenAt: null,
  lastTimestamp: 0,
  lastUpdatedAt: null,
  offset: 0,
};

const initialStateActivity = {
  createdAt: null,
  data: {},
  hash: null,
  isError: false,
  isPending: false,
  txHash: null,
  type: null,
};

// Merge current and new activities together, avoid duplicates and sort them
// afterwards by timestamp
function mergeActivities(currentActivities, newActivities) {
  return newActivities
    .reduce((acc, activity) => {
      // Do not store BN instances in redux
      if (activity.data.value && web3.utils.BN.isBN(activity.data.value)) {
        activity.data.value = activity.data.value.toString();
      }

      // Reformat object
      const newActivity = Object.assign({}, initialStateActivity, {
        createdAt: DateTime.fromSeconds(activity.timestamp).toISO(),
        data: activity.data,
        txHash: activity.transactionHash,
        type: activity.type,
      });

      // Generate a hash so we can compare it
      newActivity.hash = generateHash(newActivity);

      // Check if item already exists (maybe we've added it manually as a
      // pending task and now it got mined!
      const duplicateItemIndex = currentActivities.findIndex((item) => {
        return item.hash === newActivity.hash;
      });

      if (duplicateItemIndex < 0) {
        acc.push(newActivity);
      } else {
        // Change pending state when remote activity was detected to false.
        // Finding a remote activity means that the activity got already mined
        // + indexed by the graph!
        currentActivities[duplicateItemIndex].isPending = false;
      }

      return acc;
    }, [])
    .concat(currentActivities)
    .sort((itemA, itemB) => {
      return DateTime.fromISO(itemB.createdAt) <
        DateTime.fromISO(itemA.createdAt)
        ? -1
        : 1;
    });
}

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ACTIVITIES_INITIALIZE:
    case ActionTypes.ACTIVITIES_SET_LAST_SEEN:
      return update(state, {
        lastSeenAt: { $set: action.meta.lastSeenAt },
      });
    case ActionTypes.ACTIVITIES_ADD: {
      // Add a new activity which is still pending (we're waiting for this to
      // be mined!)
      const activity = Object.assign({}, initialStateActivity, action.meta, {
        createdAt: DateTime.local().toISO(),
        isPending: true,
      });

      // Generate a hash so we can compare it later with incoming activities
      activity.hash = generateHash(activity);

      const newActivities = state.activities
        .concat([activity])
        .sort((itemA, itemB) => {
          return DateTime.fromISO(itemB.createdAt) <
            DateTime.fromISO(itemA.createdAt)
            ? -1
            : 1;
        });

      return update(state, {
        activities: { $set: newActivities },
      });
    }
    case ActionTypes.ACTIVITIES_LOAD_MORE:
      return update(state, {
        isError: { $set: false },
        isLoadingMore: { $set: true },
      });
    case ActionTypes.ACTIVITIES_LOAD_MORE_SUCCESS: {
      // Nothing more to add ..
      if (action.meta.activities.length === 0) {
        return update(state, {
          isLoadingMore: { $set: false },
          isMoreAvailable: { $set: false },
        });
      }

      // Add new activities
      const newActivities = mergeActivities(
        state.activities,
        action.meta.activities,
      );

      // Update offset and add new objects
      return update(state, {
        activities: { $set: newActivities },
        isLoadingMore: { $set: false },
        offset: { $set: action.meta.offset },
      });
    }
    case ActionTypes.ACTIVITIES_LOAD_MORE_ERROR:
      return update(state, {
        isLoadingMore: { $set: false },
      });
    case ActionTypes.ACTIVITIES_UPDATE:
      return update(state, {
        isLoading: { $set: true },
        isError: { $set: false },
      });
    case ActionTypes.ACTIVITIES_UPDATE_SUCCESS: {
      // Nothing to add .. array is empty
      if (action.meta.activities.length === 0) {
        return update(state, {
          isLoading: { $set: false },
          lastUpdatedAt: { $set: DateTime.local().toISO() },
        });
      }

      // Add new activities
      const newActivities = mergeActivities(
        state.activities,
        action.meta.activities,
      );

      // Update timestamps and add new objects
      return update(state, {
        activities: { $set: newActivities },
        isLoading: { $set: false },
        lastTimestamp: { $set: action.meta.lastTimestamp },
        lastUpdatedAt: { $set: DateTime.local().toISO() },
      });
    }
    case ActionTypes.ACTIVITIES_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
        isError: { $set: true },
      });
    case ActionTypes.ACTIVITIES_RESET:
      return update(state, { $set: initialState });
    case ActionTypes.ACTIVITIES_SET_STATUS: {
      const index = state.activities.findIndex((item) => {
        return item.hash === action.meta.hash;
      });

      if (index === -1) {
        return state;
      }

      const { isPending, isError } = action.meta;

      return update(state, {
        activities: {
          [index]: {
            $set: Object.assign({}, state.activities[index], {
              isPending,
              isError,
            }),
          },
        },
      });
    }
    default:
      return state;
  }
};

export default activityReducer;
