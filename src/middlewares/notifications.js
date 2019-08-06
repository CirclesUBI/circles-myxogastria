import notify, { NOTIFY } from '~/store/notifications/actions';

export default store => next => action => {
  if (NOTIFY in action) {
    store.dispatch(notify(action[NOTIFY]));
  }

  return next(action);
};
