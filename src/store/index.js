import { combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';

import walletReducer from '~/store/wallet/reducers';

const rootReducer = combineReducers({
  i18nState,
  wallet: walletReducer,
});

export default rootReducer;
