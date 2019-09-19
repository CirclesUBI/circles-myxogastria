import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Routes from '~/routes';
import View from '~/components/View';
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
      <Header />

      <View>
        <Routes />
      </View>

      <Footer />
    </Router>
  );
};

export default App;
