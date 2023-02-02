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
import translate from '~/services/locale';
import resolveUsernames from '~/services/username';
import web3 from '~/services/web3';
import { CATEGORIES } from '~/store/activity/reducers';
import ActionTypes from '~/store/activity/types';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { formatCirclesValue } from '~/utils/format';

const { ActivityTypes } = core.activity;

const PAGE_SIZE = 10;

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
        if (!activity.isPending) {
          return;
        }

        let isError;

        // Check transaction mining state
        const receipt = await web3.eth.getTransactionReceipt(activity.txHash);
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

    if (!safe.currentAccount) {
      return;
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
        if (category === CATEGORIES[1]) {
          const lastReceivedTransactionDate = DateTime.fromISO(
            getLastReceivedTransaction(),
          );
          for await (const receivedTransferActivity of activities) {
            if (receivedTransferActivity.type === ActivityTypes.HUB_TRANSFER) {
              const receivedTransferActivityDate = DateTime.fromSeconds(
                receivedTransferActivity.timestamp,
              );
              if (receivedTransferActivityDate > lastReceivedTransactionDate) {
                const sender = receivedTransferActivity?.data?.from;
                let senderName = '';
                const senderData = await resolveUsernames([sender], true);
                if (sender in senderData) {
                  senderName = senderData[sender].username;
                }
                const valueInCircles = formatCirclesValue(
                  receivedTransferActivity.data?.value,
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
                    text,
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
      } catch {
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

export function resetActivities({ isClearingStorage = true } = {}) {
  if (isClearingStorage) {
    removeLastSeen();
  }

  return {
    type: ActionTypes.ACTIVITIES_RESET,
  };
}
