import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ConnectivityStatus from '~/components/ConnectivityStatus';
import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import logError from '~/services/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
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
      <ConnectivityStatus />
      <Notifications />
      <Routes />
    </Router>
  );
};

App.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default App;
