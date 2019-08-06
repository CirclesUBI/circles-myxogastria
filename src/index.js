import I18n from 'redux-i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from '~/routes';
import locales from '../locales';
import store from '~/configureStore';
import { initializeWallet } from '~/store/wallet/actions';

store.dispatch(initializeWallet());

const Root = () => (
  <Provider store={store}>
    <I18n translations={locales}>
      <Router>
        <Routes />
      </Router>
    </I18n>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app'));
