import update from 'immutability-helper';
import { DateTime } from 'luxon';

import core from '~/services/core';
import web3 from '~/services/web3';
import { PAGE_SIZE } from '~/store/activity/actions';
import ActionTypes from '~/store/activity/types';

// Every item in the activities list has an unique hash identifier
function generateHash(activity) {
  const value = `${activity.txHash}${activity.type.toString()}`;
  return web3.utils.sha3(value);
}

const { ActivityFilterTypes } = core.activity;

export const CATEGORIES = [
  ActivityFilterTypes.CONNECTIONS,
  ActivityFilterTypes.TRANSFERS,
];

const initialStateCategory = {
  activities: [],
  isError: false,
  isLoadingMore: true,
  isMoreAvailable: true,
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

const initialStateActivityMutual = {
  activities: [],
  isError: false,
  isLoadingMore: true,
  isMoreAvailable: true,
  lastTimestamp: 0,
  lastUpdatedAt: null,
  offset: 0,
  mutualAddress: null,
};

const initialState = {
  categories: CATEGORIES.reduce((acc, category) => {
    acc[category] = initialStateCategory;
    return acc;
  }, {}),
  lastSeenAt: null,
  mutualActivities: { ...initialStateActivityMutual },
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
        // + indexed by the subgraph (or an alternative data indexer)!
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

      const newActivities = state.categories[action.meta.category].activities
        .concat([activity])
        .sort((itemA, itemB) => {
          return DateTime.fromISO(itemB.createdAt) <
            DateTime.fromISO(itemA.createdAt)
            ? -1
            : 1;
        });

      return update(state, {
        categories: {
          [action.meta.category]: {
            activities: { $set: newActivities },
          },
        },
      });
    }
    case ActionTypes.ACTIVITIES_LOAD_MORE:
      return update(state, {
        categories: {
          [action.meta.category]: {
            isError: { $set: false },
            isLoadingMore: { $set: true },
          },
        },
      });
    case ActionTypes.ACTIVITIES_LOAD_MORE_SUCCESS: {
      // Add new activities
      const newActivities = mergeActivities(
        state.categories[action.meta.category].activities,
        action.meta.activities,
      );

      return update(state, {
        categories: {
          [action.meta.category]: {
            isLoadingMore: { $set: false },
            ...(action.meta.activities.length < PAGE_SIZE
              ? { isMoreAvailable: { $set: false } }
              : {}),
            activities: { $set: newActivities },
            ...(action.meta.activities.length >= PAGE_SIZE
              ? { offset: { $set: action.meta.offset } }
              : {}),
          },
        },
      });
    }
    case ActionTypes.ACTIVITIES_LOAD_MORE_ERROR:
      return update(state, {
        categories: {
          [action.meta.category]: {
            isLoadingMore: { $set: false },
          },
        },
      });
    case ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE:
      return update(state, {
        mutualActivities: {
          isError: { $set: false },
          isLoadingMore: { $set: true },
        },
      });
    case ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE_SUCCESS: {
      // Add new activities
      const newActivities = mergeActivities(
        state.mutualActivities.activities,
        action.meta.activities,
      );

      return update(state, {
        mutualActivities: {
          activities: { $set: newActivities },
          isLoadingMore: { $set: false },
          offset: { $set: action.meta.offset },
          ...(action.meta.activities.length < PAGE_SIZE
            ? { isMoreAvailable: { $set: false } }
            : {}),
          lastUpdatedAt: { $set: DateTime.local().toISO() },
          lastTimestamp: { $set: action.meta.lastTimestamp },
        },
      });
    }
    case ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE_ERROR:
      return update(state, {
        mutualActivities: {
          isLoadingMore: { $set: false },
          isError: { $set: true },
        },
      });
    case ActionTypes.ACTIVITIES_UPDATE:
      return update(state, {
        categories: {
          [action.meta.category]: {
            isError: { $set: false },
          },
        },
      });
    case ActionTypes.ACTIVITIES_UPDATE_SUCCESS: {
      // Add new activities
      const newActivities = mergeActivities(
        state.categories[action.meta.category].activities,
        action.meta.activities,
      );

      return update(state, {
        categories: {
          [action.meta.category]: {
            activities: { $set: newActivities },
            ...(action.meta.activities.length < PAGE_SIZE
              ? { isMoreAvailable: { $set: false } }
              : {}),
            isLoadingMore: { $set: false },
            lastTimestamp: { $set: action.meta.lastTimestamp },
            lastUpdatedAt: { $set: DateTime.local().toISO() },
          },
        },
      });
    }
    case ActionTypes.ACTIVITIES_UPDATE_ERROR:
      return update(state, {
        categories: {
          [action.meta.category]: {
            isLoadingMore: { $set: false },
            isError: { $set: true },
          },
        },
      });
    case ActionTypes.ACTIVITIES_RESET:
      return update(state, { $set: initialState });
    case ActionTypes.ACTIVITIES_MUTUAL_RESET:
      return update(state, {
        mutualActivities: { $set: initialStateActivityMutual },
      });
    case ActionTypes.ACTIVITIES_MUTUAL_ADDRESS_UPDATE:
      return update(state, {
        mutualActivities: {
          mutualAddress: { $set: action.meta.mutualAddress },
        },
      });
    case ActionTypes.ACTIVITIES_SET_STATUS: {
      const index = state.categories[action.meta.category].activities.findIndex(
        (item) => {
          return item.hash === action.meta.hash;
        },
      );

      if (index === -1) {
        return state;
      }

      const { isPending, isError } = action.meta;

      return update(state, {
        categories: {
          [action.meta.category]: {
            activities: {
              [index]: {
                $set: Object.assign(
                  {},
                  state.categories[action.meta.category].activities[index],
                  {
                    isPending,
                    isError,
                  },
                ),
              },
            },
          },
        },
      });
    }
    default:
      return state;
  }
};

export default activityReducer;
