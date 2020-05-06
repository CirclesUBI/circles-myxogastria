import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import GlobalStyle from '~/styles';
import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import SpinnerOverlay from '~/components/SpinnerOverlay';
import UBI from '~/components/UBI';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
import { checkAppState, initializeApp } from '~/store/app/actions';

const APP_CHECK_FRQUENCY = 1000 * 4;

const App = (props, context) => {
  let checkInterval;

  const app = useSelector((state) => state.app);

  const dispatch = useDispatch();

  const onAppStart = () => {
    const initialize = async () => {
      try {
        await dispatch(initializeApp());
        await dispatch(checkAppState());
      } catch (error) {
        logError(error);
      }
    };

    initialize();

    const checkFrequency =
      process.env.NODE_ENV === 'production' ? APP_CHECK_FRQUENCY : 1000 * 10;

    checkInterval = window.setInterval(async () => {
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
    }, checkFrequency);
  };

  useEffect(onAppStart, []);

  // Register an event to disable state checks
  // when we are leaving the application
  window.addEventListener('unload', () => {
    window.clearInterval(checkInterval);
  });

  return (
    <Router>
      <GlobalStyle />

      <AppStyle>
        <UBI />
        <Notifications />
        <SpinnerOverlay isVisible={app.isLoading} />
        <Routes />
      </AppStyle>
    </Router>
  );
};

App.contextTypes = {
  t: PropTypes.func.isRequired,
};

const AppStyle = styled.div`
  @media ${styles.media.desktop} {
    width: ${styles.base.layout.width};
    height: ${styles.base.layout.height};

    border-radius: ${styles.base.layout.borderRadius};
  }

  position: relative;

  overflow: hidden;

  min-width: 320px;
  height: 100%;

  margin: 0 auto;

  background-color: ${styles.base.background.color};

  box-shadow: 0 0 25px ${styles.monochrome.gray};
`;

export default App;
