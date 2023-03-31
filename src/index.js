import CssBaseline from '@mui/material/CssBaseline';
import NoSsr from '@mui/material/NoSsr';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </NoSsr>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

ReactDOM.render(<Root store={store} />, document.getElementById('app'));
