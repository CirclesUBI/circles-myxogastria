import { combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';

import activityReducer from '~/store/activity/reducers';
import appReducer from '~/store/app/reducers';
import notificationsReducer from '~/store/notifications/reducers';
import safeReducer from '~/store/safe/reducers';
import tokenReducer from '~/store/token/reducers';
import trustReducer from '~/store/trust/reducers';
import walletReducer from '~/store/wallet/reducers';

const rootReducer = combineReducers({
  i18nState,
  activity: activityReducer,
  app: appReducer,
  notifications: notificationsReducer,
  safe: safeReducer,
  token: tokenReducer,
  trust: trustReducer,
  wallet: walletReducer,
});

export default rootReducer;
