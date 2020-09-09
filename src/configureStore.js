import { createStore, applyMiddleware } from 'redux';

import middlewares from '~/middlewares';
import reducers from '~/store';

export default createStore(reducers, applyMiddleware(...middlewares));
