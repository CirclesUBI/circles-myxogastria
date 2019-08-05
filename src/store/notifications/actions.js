import ActionTypes from '~/store/notifications/types';

let internalCounter = 0;

export const NotificationsTypes = {
  INFO: Symbol('NotificationsTypesInfo'),
  WARNING: Symbol('NotificationsTypesWarning'),
  ERROR: Symbol('NotificationsTypesError'),
};

export default function notify(options) {
  const { text, type = NotificationsTypes.INFO } = options;

  return dispatch => {
    dispatch({
      type: ActionTypes.NOTIFICATIONS_ADD,
      meta: {
        id: ++internalCounter,
        text,
        type,
      },
    });
  };
}

export function removeNotification(id) {
  return {
    type: ActionTypes.NOTIFICATIONS_REMOVE,
    meta: {
      id,
    },
  };
}

export function removeAllNotifications() {
  return {
    type: ActionTypes.NOTIFICATIONS_REMOVE_ALL,
  };
}
