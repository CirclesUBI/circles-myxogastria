import update from 'immutability-helper';

import ActionTypes from '~/store/activity/types';
import web3 from '~/services/web3';

function generateHash(activity) {
  const value = `${activity.txHash}${activity.type.toString()}`;

  return web3.utils.sha3(value);
}

const initialState = {
  activities: [],
  isError: false,
  isLoading: false,
  isLoadingMore: false,
  isMore: true,
  lastSeen: 0,
  lastTimestamp: 0,
  lastUpdated: 0,
  nextId: 1,
  offset: 0,
};

const initialStateActivity = {
  data: {},
  id: 1,
  isError: false,
  isPending: false,
  timestamp: 0,
  txHash: null,
  type: null,
};

const activityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ACTIVITIES_INITIALIZE:
      return update(state, {
        lastSeen: { $set: action.meta.lastSeen },
      });
    case ActionTypes.ACTIVITIES_ADD: {
      // Add a new activity which is still pending (we're
      // waiting for this to be mined!)
      const activity = Object.assign({}, initialStateActivity, action.meta, {
        id: state.nextId,
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
        nextId: { $set: state.nextId + 1 },
      });
    }
    case ActionTypes.ACTIVITIES_REMOVE: {
      const index = state.activities.findIndex((item) => {
        return item.id === action.meta.id;
      });

      if (index === -1) {
        return state;
      }

      return update(state, {
        activities: { $splice: [[index, 1]] },
      });
    }
    case ActionTypes.ACTIVITIES_SET_LAST_SEEN:
      return update(state, {
        lastSeen: { $set: action.meta.lastSeen },
      });
    case ActionTypes.ACTIVITIES_UPDATE:
      return update(state, {
        isLoading: { $set: true },
        isLoadingMore: { $set: action.meta.offset > 0 },
        isError: { $set: false },
        offset: {
          $set: action.meta.offset === 0 ? state.offset : action.meta.offset,
        },
      });
    case ActionTypes.ACTIVITIES_UPDATE_SUCCESS: {
      // Nothing to add .. array is empty
      if (action.meta.activities.length === 0) {
        return update(state, {
          isLoading: { $set: false },
          isLoadingMore: {
            $set: action.meta.offset > 0 ? false : state.isLoadingMore,
          },
          lastUpdated: { $set: Date.now() },
          isMore: { $set: action.meta.offset > 0 ? false : state.isMore },
        });
      }

      // Create new activities
      const newActivities = action.meta.activities
        .reduce((acc, activity, index) => {
          // We get the timestamp in seconds from the graph service
          const timestamp = parseInt(`${activity.timestamp}000`);

          // Reformat object
          const newActivity = Object.assign({}, initialStateActivity, {
            data: activity.data,
            id: state.nextId + index,
            timestamp,
            txHash: activity.transactionHash,
            type: activity.type,
          });

          // Generate a hash so we can compare it
          newActivity.hash = generateHash(newActivity);

          // Check if item already exists (maybe we've
          // added it manually as a pending task and
          // now it got mined!
          const isDuplicate = state.activities.find((item) => {
            return item.hash === newActivity.hash;
          });

          if (!isDuplicate) {
            acc.push(newActivity);
          }

          return acc;
        }, [])
        .sort((itemA, itemB) => {
          return itemB.timestamp - itemA.timestamp;
        });

      // Update timestamps and add new objects
      return update(state, {
        activities: { $push: newActivities },
        isLoading: { $set: false },
        isLoadingMore: {
          $set: action.meta.offset > 0 ? false : state.isLoadingMore,
        },
        lastTimestamp: { $set: action.meta.lastTimestamp },
        lastUpdated: { $set: Date.now() },
        nextId: { $set: state.nextId + newActivities.length },
      });
    }
    case ActionTypes.ACTIVITIES_UPDATE_ERROR:
      return update(state, {
        isLoading: { $set: false },
        isError: { $set: true },
      });
    case ActionTypes.ACTIVITIES_REMOVE_ALL:
      return update(state, { $set: initialState });
    case ActionTypes.ACTIVITIES_SET_STATUS: {
      const index = state.activities.findIndex((item) => {
        return item.id === action.meta.id;
      });

      if (index === -1) {
        return state;
      }

      const { isPending, isError } = action.meta;

      const updatedActivity = Object.assign({}, state.activities[index], {
        isPending,
        isError,
      });

      return update(state, {
        activities: {
          [index]: {
            $set: updatedActivity,
          },
        },
      });
    }
    default:
      return state;
  }
};

export default activityReducer;
