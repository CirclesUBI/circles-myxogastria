import PropTypes from 'prop-types';
import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ConnectAccount from '~/views/ConnectAccount';
import CreateNewAccount from '~/views/CreateNewAccount';
import Dashboard from '~/views/Dashboard';
import NotFound from '~/views/NotFound';
import Welcome from '~/views/Welcome';

// This Route is only accessible when not running
// a valid Session yet
const OnboardingRoute = ({ component: Component, path }) => {
  const { walletAddress, safeAddress } = useSelector(state => state.wallet);

  if (walletAddress && safeAddress) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};

// This Route is only accessible when running a valid
// Session, otherwise the user will be redirected
const SessionRoute = ({ component: Component, path }) => {
  const { safeAddress } = useSelector(state => state.wallet);

  let redirectPath;

  if (!safeAddress) {
    redirectPath = '/welcome';
  }

  if (redirectPath) {
    return (
      <Route path={path}>
        <Redirect to={redirectPath} />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};

const Routes = () => (
  <Switch>
    <SessionRoute component={Dashboard} exact path="/" />
    <OnboardingRoute component={CreateNewAccount} path="/welcome/new" />
    <OnboardingRoute component={ConnectAccount} path="/welcome/connect" />
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
