import { combineReducers } from 'redux';

import walletReducer from '~/store/wallet/reducers';

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export default rootReducer;
