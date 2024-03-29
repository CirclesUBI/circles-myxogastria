import ActionTypes from '~/store/notifications/types';

const DEFAULT_LIFETIME = 10000;

export const NOTIFY = Symbol('Notifications');

export const NotificationsTypes = {
  SUCCESS: 'success',
  INFO: 'info',
  ERROR: 'error',
  SPECIAL: 'warning',
};

export default function notify(options) {
  const {
    text,
    icon,
    action,
    type = NotificationsTypes.INFO,
    lifetime = DEFAULT_LIFETIME,
  } = options;

  return {
    type: ActionTypes.NOTIFICATIONS_ADD,
    meta: {
      icon,
      action,
      lifetime,
      text,
      type,
    },
  };
}

export function dismissNotification(id) {
  return {
    type: ActionTypes.NOTIFICATIONS_DISMISS,
    meta: {
      id,
    },
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
