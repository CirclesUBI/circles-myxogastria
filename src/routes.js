import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AccountConnect from '~/views/AccountConnect';
import AccountCreate from '~/views/AccountCreate';
import AccountImport from '~/views/AccountImport';
import Dashboard from '~/views/Dashboard';
import NotFound from '~/views/NotFound';
import Settings from '~/views/Settings';
import SettingsExport from '~/views/SettingsExport';
import Welcome from '~/views/Welcome';
import { ensureSafeAddress } from '~/utils/state';

const SessionContainer = ({ component: Component, isSessionRequired }) => {
  const { safe, address } = useSelector(state => {
    return {
      safe: state.safe,
      address: state.wallet.address,
    };
  });

  const isValidSession = ensureSafeAddress(safe) && address;

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
    <SessionRoute component={Settings} exact path="/settings" />
    <SessionRoute component={SettingsExport} exact path="/settings/export" />
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
