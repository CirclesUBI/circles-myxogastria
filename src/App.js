import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ConnectivityStatus from '~/components/ConnectivityStatus';
import GlobalStyle from '~/styles';
import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import logError from '~/services/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
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
    <Router>
      <GlobalStyle />

      <Wrapper>
        <ConnectivityStatus />
        <Notifications />
        <Routes />
      </Wrapper>
    </Router>
  );
};

App.contextTypes = {
  t: PropTypes.func.isRequired,
};

const Wrapper = styled.div`
  @media ${styles.device.desktop} {
    max-height: ${styles.layout.height};

    width: ${styles.layout.width};

    border-radius: ${styles.border.radius};
  }

  position: relative;

  min-width: 320px;
  height: 100%;

  margin: 0 auto;

  background-color: ${styles.colors.background};

  box-shadow: 0 0 ${styles.shadow.blur} ${styles.shadow.color};
`;

export default App;
