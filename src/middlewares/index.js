import logger from 'redux-logger';
import thunk from 'redux-thunk';

import notificationsMiddleware from '~/middlewares/notifications';

const middlewares = [thunk, notificationsMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default middlewares;
