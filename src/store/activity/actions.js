import { Typography } from '@mui/material';
import { DateTime } from 'luxon';
import React from 'react';

import {
  getLastReceivedTransaction,
  getLastSeen,
  removeLastSeen,
  setLastReceivedTransaction,
  setLastSeen,
  typeToCategory,
} from '~/services/activity';
import core from '~/services/core';
import ethProvider from '~/services/ethProvider';
import translate from '~/services/locale';
import resolveUsernames from '~/services/username';
import { CATEGORIES } from '~/store/activity/reducers';
import ActionTypes from '~/store/activity/types';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import logError, { translateErrorForUser } from '~/utils/debug';
import { formatCirclesValue } from '~/utils/format';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

export const PAGE_SIZE = 10;

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
      category: typeToCategory(type),
      data,
      txHash,
      type,
    },
  };
}

export function checkPendingActivities() {
  return async (dispatch, getState) => {
    const { activity, safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    for await (const category of CATEGORIES) {
      activity.categories[category].activities.forEach(async (activity) => {
        // We only need check pending activities and activities without
        // txHash are not ready to be checked.
        if (!activity.isPending || !activity.txHash) {
          return;
        }

        let isError;

        // Check transaction mining state
        const receipt = await ethProvider.getTransactionReceipt(
          activity.txHash,
        );
        isError = receipt !== null && !receipt.status;

        if (activity.isError !== isError) {
          dispatch({
            type: ActionTypes.ACTIVITIES_SET_STATUS,
            meta: {
              category: typeToCategory(activity.type),
              hash: activity.hash,
              isError,
              isPending: true,
            },
          });
        }
      });
    }
  };
}

export function checkFinishedActivities({
  isCheckingOnlyPending = false,
} = {}) {
  return async (dispatch, getState) => {
    const { safe, activity } = getState();
    const { mutualActivities } = activity;

    if (!safe.currentAccount) {
      return;
    }

    dispatch(
      loadMoreActivitiesNews({
        fromOffsetZero: true,
        withLoader: false,
        liveRefresh: true,
      }),
    );

    // Check for mutual activities with other user address
    if (
      `/profile/${mutualActivities.mutualAddress}` === window.location.pathname
    ) {
      dispatch(
        loadMoreActivitiesMutual(mutualActivities.mutualAddress, {
          fromOffsetZero: true,
          withLoader: false,
          liveRefresh: true,
        }),
      );
    }

    for await (const category of CATEGORIES) {
      dispatch({
        type: ActionTypes.ACTIVITIES_UPDATE,
        meta: {
          category,
        },
      });

      // Do not check activity state when nothing is pending
      const isAnyPending = !!activity.categories[category].activities.find(
        (activity) => {
          return activity.isPending;
        },
      );

      if (!isAnyPending && isCheckingOnlyPending) {
        return;
      }

      try {
        const { activities, lastTimestamp } = await core.activity.getLatest(
          safe.currentAccount,
          category,
          PAGE_SIZE,
          activity.lastTimestamp,
        );

        // Check received transactions from different users and notify user about them if necessary
        if (category === ActivityFilterTypes.TRANSFERS) {
          const lastReceivedTransactionDate = DateTime.fromISO(
            getLastReceivedTransaction(),
          );

          for await (const receivedTransferActivity of activities) {
            if (receivedTransferActivity.type === ActivityTypes.HUB_TRANSFER) {
              const receivedTransferActivityDate = DateTime.fromSeconds(
                receivedTransferActivity.timestamp,
              );

              const sender = receivedTransferActivity?.data?.from;

              if (
                receivedTransferActivityDate > lastReceivedTransactionDate &&
                sender !== safe.currentAccount
              ) {
                let senderName = '';
                const senderData = await resolveUsernames([sender], true);
                if (sender in senderData) {
                  senderName = senderData[sender].username;
                }
                const valueInCircles = formatCirclesValue(
                  receivedTransferActivity.data?.value,
                  receivedTransferActivityDate,
                  2,
                  false,
                );

                const text = (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translate('SendConfirm.receiveSuccessMessage', {
                        amount: valueInCircles,
                        username: senderName,
                      }),
                    }}
                  />
                );

                dispatch(
                  notify({
                    text: (
                      <Typography
                        classes={{ root: 'body4_white' }}
                        variant="body4"
                      >
                        {text}
                      </Typography>
                    ),
                    type: NotificationsTypes.SUCCESS,
                  }),
                );
              }
            }
          }
          setLastReceivedTransaction(DateTime.now().toISO());
        }

        dispatch({
          type: ActionTypes.ACTIVITIES_UPDATE_SUCCESS,
          meta: {
            activities,
            category,
            lastTimestamp,
          },
        });
      } catch (error) {
        dispatch({
          type: ActionTypes.ACTIVITIES_UPDATE_ERROR,
          meta: {
            category,
          },
        });
      }
    }
  };
}

export function loadMoreAllActivities() {
  return async (dispatch) => {
    for await (const category of CATEGORIES) {
      await dispatch(loadMoreActivities(category));
    }
  };
}

export function loadMoreActivities(category) {
  return async (dispatch, getState) => {
    const { safe, activity } = getState();

    if (!safe.currentAccount) {
      return;
    }

    dispatch({
      type: ActionTypes.ACTIVITIES_LOAD_MORE,
      meta: {
        category,
      },
    });

    const offset = activity.categories[category].offset + PAGE_SIZE;

    try {
      const { activities } = await core.activity.getLatest(
        safe.currentAccount,
        category,
        PAGE_SIZE,
        0,
        offset,
      );

      dispatch({
        type: ActionTypes.ACTIVITIES_LOAD_MORE_SUCCESS,
        meta: {
          activities,
          category,
          offset,
        },
      });
    } catch {
      dispatch({
        type: ActionTypes.ACTIVITIES_LOAD_MORE_ERROR,
        meta: {
          category,
        },
      });
    }
  };
}

export function loadMoreActivitiesMutual(otherSafeAddress, options = {}) {
  const {
    fromOffsetZero = false,
    withLoader = true,
    liveRefresh = false,
  } = options;
  return async (dispatch, getState) => {
    const { safe, activity } = getState();
    const currentOffset = activity.mutualActivities.offset;

    if (!safe.currentAccount) {
      return;
    }

    if (withLoader) {
      dispatch({
        type: ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE,
      });
    }

    const offset = fromOffsetZero ? 0 : activity.mutualActivities.offset;

    try {
      const { activities, lastTimestamp } = await core.activity.getLatest(
        safe.currentAccount,
        ActivityFilterTypes.DISABLED,
        PAGE_SIZE,
        activity.lastTimestamp,
        offset,
        otherSafeAddress,
      );

      dispatch({
        type: ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE_SUCCESS,
        meta: {
          activities,
          offset: liveRefresh ? currentOffset : currentOffset + PAGE_SIZE,
          lastTimestamp,
        },
      });
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translateErrorForUser(error)}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
      dispatch({
        type: ActionTypes.ACTIVITIES_MUTUAL_LOAD_MORE_ERROR,
      });
    }
  };
}

export function loadMoreActivitiesNews(options = {}) {
  const {
    fromOffsetZero = false,
    withLoader = true,
    liveRefresh = false,
  } = options;
  return async (dispatch, getState) => {
    const { activity } = getState();
    const currentOffset = activity.news.offset;
    const currentNews = activity.news.activities;

    if (withLoader) {
      dispatch({
        type: ActionTypes.ACTIVITIES_NEWS_LOAD_MORE,
      });
    }

    let offset = fromOffsetZero ? 0 : currentOffset;

    function tillNow(item) {
      return item.date ? DateTime.fromISO(item.date) <= DateTime.now() : [];
    }

    function checkForDuplicates(item) {
      for (const newsItem of currentNews) {
        if (newsItem.id === item.id) {
          return false;
        }
      }
      return true;
    }

    try {
      let newsData = [];
      let filteredNewsData = [];
      let filterDuplicateNewsData = [];
      let noMoreRecords = false;

      do {
        let data = await core.news.getLatestNews(offset, PAGE_SIZE);

        if (data.length === 0) {
          noMoreRecords = true;
          break;
        }

        // we want only values till present time not future
        filteredNewsData = data?.filter(tillNow);

        // we have some values in table as well and we do not want duplicates so we filter
        // we don't filter when liveRefresh as than we may endup with no results
        // depends on amount of news to display in future in database
        if (!liveRefresh) {
          filterDuplicateNewsData = filteredNewsData.filter(checkForDuplicates);
        } else {
          filterDuplicateNewsData = filteredNewsData;
        }

        // we have values till present which are not duplicates - we add them to newsData which we want to display
        newsData.push(...filterDuplicateNewsData);
        offset += PAGE_SIZE;
      } while (!noMoreRecords && newsData.length < PAGE_SIZE);

      dispatch({
        type: ActionTypes.ACTIVITIES_NEWS_LOAD_MORE_SUCCESS,
        meta: {
          activities: newsData,
          offset: liveRefresh ? currentOffset : offset,
        },
      });
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translateErrorForUser(error)}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
      dispatch({
        type: ActionTypes.ACTIVITIES_NEWS_LOAD_MORE_ERROR,
      });
    }
  };
}

export function resetActivities({ isClearingStorage = true } = {}) {
  if (isClearingStorage) {
    removeLastSeen();
  }

  return {
    type: ActionTypes.ACTIVITIES_RESET,
  };
}
