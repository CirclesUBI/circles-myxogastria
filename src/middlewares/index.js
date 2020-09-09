import logger from 'redux-logger';
import thunk from 'redux-thunk';

import appMiddleware from '~/middlewares/app';
import notificationsMiddleware from '~/middlewares/notifications';

const middlewares = [thunk, appMiddleware, notificationsMiddleware];

if (process.env.NODE_ENV === 'development') {
  if (!window.location.search.includes('disableLog')) {
    middlewares.push(logger);
  }
}

export default middlewares;
