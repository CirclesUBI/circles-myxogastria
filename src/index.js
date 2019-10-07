import I18n from 'redux-i18n';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from '~/App';
import locales from '~/../locales';
import store from '~/configureStore';

const Root = props => (
  <Provider store={props.store}>
    <I18n translations={props.locales}>
      <App />
    </I18n>
  </Provider>
);

Root.propTypes = {
  locales: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

ReactDOM.render(
  <Root locales={locales} store={store} />,
  document.getElementById('app'),
);
