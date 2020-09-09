import CssBaseline from '@material-ui/core/CssBaseline';
import I18n from 'redux-i18n';
import NoSsr from '@material-ui/core/NoSsr';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';

import App from '~/App';
import initializeSentry from '~/services/sentry';
import store from '~/configureStore';
import theme from '~/styles/theme';

import locales from 'locales';

initializeSentry();

const Root = (props) => (
  <Provider store={props.store}>
    <I18n translations={props.locales}>
      <NoSsr>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </NoSsr>
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
