import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from '~/routes';
import store from '~/configureStore';
import { initializeWallet } from '~/store/wallet/actions';

store.dispatch(initializeWallet());

const Root = () => (
  <Provider store={store}>
    <Router>
      <Routes />
    </Router>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app'));
