import notify from '~/store/notifications/actions';

export const NOTIFY = Symbol('Notifications');

export default store => next => action => {
  if (NOTIFY in action) {
    store.dispatch(notify(action[NOTIFY]));
  }

  return next(action);
};
