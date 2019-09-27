import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import { initializeApp, checkAppState } from '~/store/app/actions';

const APP_CHECK_FRQUENCY = 1000 * 10;

const App = () => {
  const dispatch = useDispatch();

  const onAppStart = () => {
    dispatch(initializeApp());

    window.setInterval(() => {
      dispatch(checkAppState());
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
