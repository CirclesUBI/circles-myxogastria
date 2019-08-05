import { combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';

import notificationsReducer from '~/store/notifications/reducers';
import walletReducer from '~/store/wallet/reducers';

const rootReducer = combineReducers({
  i18nState,
  notifications: notificationsReducer,
  wallet: walletReducer,
});

export default rootReducer;
