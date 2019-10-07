import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import logError from '~/services/debug';
import notify, { NotificationTypes } from '~/store/notifications/actions';
import { initializeApp, checkAppState } from '~/store/app/actions';

const APP_CHECK_FRQUENCY = 1000 * 10;

const App = () => {
  const dispatch = useDispatch();

  const onAppStart = () => {
    try {
      dispatch(initializeApp());
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: '', // @TODO
          type: NotificationTypes.ERROR,
        }),
      );
    }

    window.setInterval(() => {
      try {
        dispatch(checkAppState());
      } catch (error) {
        logError(error);
      }
    }, APP_CHECK_FRQUENCY);
  };

  useEffect(onAppStart, []);

  return (
    <Router>
      <Notifications />
      <Routes />
    </Router>
  );
};

export default App;
