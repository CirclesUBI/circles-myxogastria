import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ConnectivityStatus from '~/components/ConnectivityStatus';
import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import logError from '~/services/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import theme from '~/styles';
import { initializeApp, checkAppState } from '~/store/app/actions';

const APP_CHECK_FRQUENCY = 1000 * 10;

const App = (props, context) => {
  const dispatch = useDispatch();

  const onAppStart = () => {
    const initialize = async () => {
      try {
        await dispatch(initializeApp());
      } catch (error) {
        logError(error);
      }
    };

    initialize();

    window.setInterval(async () => {
      try {
        await dispatch(checkAppState());
      } catch (error) {
        logError(error);

        dispatch(
          notify({
            text: context.t('App.updateErrorMessage'),
            type: NotificationsTypes.ERROR,
          }),
        );
      }
    }, APP_CHECK_FRQUENCY);
  };

  useEffect(onAppStart, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />

      <Router>
        <AppContainer>
          <ConnectivityStatus />
          <Notifications />
          <Routes />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
};

App.contextTypes = {
  t: PropTypes.func.isRequired,
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
  }

  body {
    display: flex;

    justify-content: center;
    align-items: center;

    background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)
  }
`;

const AppContainer = styled.div`
  width: 50rem;
  height: 30rem;

  margin: 0 auto;

  border-radius: 1rem;

  background-color: white;
`;

export default App;
