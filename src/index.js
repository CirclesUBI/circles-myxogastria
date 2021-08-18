import CssBaseline from '@material-ui/core/CssBaseline';
import NoSsr from '@material-ui/core/NoSsr';
import { ThemeProvider } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from '~/App';
import store from '~/configureStore';

import initializeSentry from '~/services/sentry';
import theme from '~/styles/theme';

initializeSentry();

// https://docs.metamask.io/guide/ethereum-provider.html#ethereum-autorefreshonnetworkchange
if (window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

const Root = (props) => (
  <Provider store={props.store}>
    <NoSsr>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h2>Testing PR deploys</h2>
        <App />
      </ThemeProvider>
    </NoSsr>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
