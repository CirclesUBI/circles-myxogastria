import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AccountConnect from '~/views/AccountConnect';
import AccountCreate from '~/views/AccountCreate';
import AccountImport from '~/views/AccountImport';
import Activities from '~/views/Activities';
import CriticalError from '~/views/CriticalError';
import Dashboard from '~/views/Dashboard';
import NotFound from '~/views/NotFound';
import Profile from '~/views/Profile';
import Receive from '~/views/Receive';
import ReceiveShare from '~/views/ReceiveShare';
import Send from '~/views/Send';
import SendConfirm from '~/views/SendConfirm';
import Settings from '~/views/Settings';
import SettingsKeys from '~/views/SettingsKeys';
import SettingsKeysAdd from '~/views/SettingsKeysAdd';
import SettingsKeysExport from '~/views/SettingsKeysExport';
import SettingsLocale from '~/views/SettingsLocale';
import SettingsShare from '~/views/SettingsShare';
import Trust from '~/views/Trust';
import TrustConfirm from '~/views/TrustConfirm';
import Welcome from '~/views/Welcome';

const SessionContainer = ({ component: Component, isSessionRequired }) => {
  const { app, safe, wallet } = useSelector(state => {
    return {
      app: state.app,
      safe: state.safe,
      wallet: state.wallet,
    };
  });

  // Did something bad happen?
  if (app.isError) {
    return <CriticalError />;
  }

  // Do not do anything yet when we are not ready
  if (!app.isReady) {
    return null;
  }

  const isValidSession = safe.address && wallet.address;

  if (
    (isSessionRequired && isValidSession) ||
    (!isSessionRequired && !isValidSession)
  ) {
    return <Component />;
  } else if (!isSessionRequired && isValidSession) {
    return <Redirect to="/" />;
  } else if (isSessionRequired && !isValidSession) {
    return <Redirect to="/welcome" />;
  }
};

const OnboardingRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} isSessionRequired={false} />
    </Route>
  );
};

const SessionRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} isSessionRequired={true} />
    </Route>
  );
};

const Routes = () => (
  <Switch>
    <SessionRoute component={Dashboard} exact path="/" />
    <SessionRoute component={Activities} path="/activities" />
    <SessionRoute component={TrustConfirm} path="/trust/:address" />
    <SessionRoute component={Trust} path="/trust" />
    <SessionRoute component={SendConfirm} path="/send/:address" />
    <SessionRoute component={Send} path="/send" />
    <SessionRoute component={ReceiveShare} path="/receive/share" />
    <SessionRoute component={Receive} path="/receive" />
    <SessionRoute component={Profile} path="/profile/:address" />
    <SessionRoute component={SettingsKeysAdd} path="/settings/keys/add" />
    <SessionRoute component={SettingsKeysExport} path="/settings/keys/export" />
    <SessionRoute component={SettingsKeys} path="/settings/keys" />
    <SessionRoute component={SettingsLocale} path="/settings/locale" />
    <SessionRoute component={SettingsShare} path="/settings/share" />
    <SessionRoute component={Settings} path="/settings" />
    <OnboardingRoute component={AccountCreate} path="/welcome/new" />
    <OnboardingRoute component={AccountConnect} path="/welcome/connect" />
    <OnboardingRoute component={AccountImport} path="/welcome/seed" />
    <OnboardingRoute component={Welcome} path="/welcome" />
    <Route component={NotFound} />
  </Switch>
);

OnboardingRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

SessionRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

export default Routes;
