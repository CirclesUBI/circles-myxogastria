import update from 'immutability-helper';

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
  lastSeen: 0,
  lastTimestamp: 0,
  lastUpdated: 0,
  offset: 0,
};

const initialStateActivity = {
  data: {},
  isError: false,
  isPending: false,
  timestamp: 0,
  txHash: null,
  hash: null,
  type: null,
};

// Merge current and new activities together, avoid duplicates and sort them
// afterwards by timestamp
function mergeActivities(currentActivities, newActivities) {
  return newActivities
    .reduce((acc, activity) => {
      // We get the timestamp in seconds from the graph service
      const timestamp = parseInt(`${activity.timestamp}000`);

      // Reformat object
      const newActivity = Object.assign({}, initialStateActivity, {
        data: activity.data,
        timestamp,
        txHash: activity.transactionHash,
        type: activity.type,
      });

      // Generate a hash so we can compare it
      newActivity.hash = generateHash(newActivity);

      // Check if item already exists (maybe we've
      // added it manually as a pending task and
      // now it got mined!
      const isDuplicate = currentActivities.find((item) => {
        return item.hash === newActivity.hash;
      });

      if (!isDuplicate) {
        acc.push(newActivity);
      }

      return acc;
    }, [])
    .concat(currentActivities)
    .sort((itemA, itemB) => {
      return itemB.timestamp - itemA.timestamp;
    });
}

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ACTIVITIES_INITIALIZE:
    case ActionTypes.ACTIVITIES_SET_LAST_SEEN:
      return update(state, {
        lastSeen: { $set: action.meta.lastSeen },
      });
    case ActionTypes.ACTIVITIES_ADD: {
      // Add a new activity which is still pending (we're
      // waiting for this to be mined!)
      const activity = Object.assign({}, initialStateActivity, action.meta, {
        isPending: true,
        timestamp: Date.now(),
      });

      // Generate a hash so we can compare it later with
      // incoming activities
      activity.hash = generateHash(activity);

      const newActivities = state.activities
        .concat([activity])
        .sort((itemA, itemB) => {
          return itemB.timestamp - itemA.timestamp;
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
          lastUpdated: { $set: Date.now() },
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
        lastUpdated: { $set: Date.now() },
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
