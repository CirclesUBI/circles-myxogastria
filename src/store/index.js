import { combineReducers } from 'redux';

import activityReducer from '~/store/activity/reducers';
import appReducer from '~/store/app/reducers';
import notificationsReducer from '~/store/notifications/reducers';
import safeReducer from '~/store/safe/reducers';
import tokenReducer from '~/store/token/reducers';
import trustReducer from '~/store/trust/reducers';
import tutorialReducer from '~/store/tutorial/reducers';
import userReducer from '~/store/user/reducers';
import walletReducer from '~/store/wallet/reducers';

const rootReducer = combineReducers({
  activity: activityReducer,
  app: appReducer,
  notifications: notificationsReducer,
  safe: safeReducer,
  token: tokenReducer,
  trust: trustReducer,
  tutorial: tutorialReducer,
  user: userReducer,
  wallet: walletReducer,
});

export default rootReducer;
