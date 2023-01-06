import ActionTypes from '~/store/notifications/types';

const DEFAULT_LIFETIME = 5555000;

export const NOTIFY = Symbol('Notifications');

export const NotificationsTypes = {
  SUCCESS: 'success',
  SUCCESS_BROWSER: 'successBrowser',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  ERROR_REFRESH: 'errorRefresh',
  ERROR_OFFLINE: 'errorOffline',
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
