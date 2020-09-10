import CssBaseline from '@material-ui/core/CssBaseline';
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

initializeSentry();

const Root = (props) => (
  <Provider store={props.store}>
    <NoSsr>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </NoSsr>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
