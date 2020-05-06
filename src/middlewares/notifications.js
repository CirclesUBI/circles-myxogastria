import notify, { NOTIFY } from '~/store/notifications/actions';

const notificationsMiddleware = (store) => (next) => (action) => {
  if (NOTIFY in action) {
    store.dispatch(notify(action[NOTIFY]));
  }

  return next(action);
};

export default notificationsMiddleware;
