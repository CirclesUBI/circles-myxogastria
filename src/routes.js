import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AccountConnect from '~/views/AccountConnect';
import AccountCreate from '~/views/AccountCreate';
import AccountImport from '~/views/AccountImport';
import Activities from '~/views/Activities';
import CriticalError from '~/views/CriticalError';
import Dashboard from '~/views/Dashboard';
import Invite from '~/views/Invite';
import NotFound from '~/views/NotFound';
import Profile from '~/views/Profile';
import Receive from '~/views/Receive';
import ReceiveShare from '~/views/ReceiveShare';
import Search from '~/views/Search';
import Send from '~/views/Send';
import SendConfirm from '~/views/SendConfirm';
import Settings from '~/views/Settings';
import SettingsKeys from '~/views/SettingsKeys';
import SettingsKeysAdd from '~/views/SettingsKeysAdd';
import SettingsKeysExport from '~/views/SettingsKeysExport';
import SettingsShare from '~/views/SettingsShare';
import Trust from '~/views/Trust';
import TrustConfirm from '~/views/TrustConfirm';
import TrustRevokeConfirm from '~/views/TrustRevokeConfirm';
import TutorialAccountCreate from '~/views/TutorialAccountCreate';
import TutorialSettingsKeys from '~/views/TutorialSettingsKeys';
import Welcome from '~/views/Welcome';
import { ACCOUNT_CREATE, SETTINGS_KEYS } from '~/store/tutorial/actions';

const SessionContainer = ({
  component: Component,
  isSessionRequired,
  isSafeRequired,
}) => {
  const { app, safe } = useSelector(state => {
    return {
      app: state.app,
      safe: state.safe,
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

  let isFailed = false;

  if (isSessionRequired && !app.isAuthorized) {
    isFailed = true;
  }

  if (!isSessionRequired && app.isAuthorized) {
    isFailed = true;
  }

  // Is Safe not deployed yet?
  if (isSafeRequired && safe.nonce) {
    isFailed = true;
  }

  if (!isFailed) {
    return <Component />;
  }

  if (app.isAuthorized) {
    return <Redirect to="/" />;
  }

  return <Redirect to="/welcome" />;
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
      <SessionContainer component={component} isSessionRequired />
    </Route>
  );
};

const TrustedRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer
        component={component}
        isSafeRequired
        isSessionRequired
      />
    </Route>
  );
};

const TutorialContainer = props => {
  const [redirect, setRedirect] = useState(false);

  const { isFinished } = useSelector(state => {
    return state.tutorial[props.name];
  });

  if (redirect) {
    return <Redirect to={props.exitPath} />;
  }

  if (!isFinished) {
    const onExit = () => {
      setRedirect(true);
    };

    const TutorialComponent = props.componentTutorial;

    return <TutorialComponent onExit={onExit} />;
  }

  const FinalComponent = props.componentFinal;

  return <FinalComponent />;
};

const AccountCreateContainer = () => {
  return (
    <TutorialContainer
      componentFinal={AccountCreate}
      componentTutorial={TutorialAccountCreate}
      exitPath="/welcome"
      name={ACCOUNT_CREATE}
    />
  );
};

const SettingsKeysContainer = () => {
  return (
    <TutorialContainer
      componentFinal={SettingsKeys}
      componentTutorial={TutorialSettingsKeys}
      exitPath="/settings"
      name={SETTINGS_KEYS}
    />
  );
};

const Routes = () => (
  <Switch>
    <SessionRoute component={Dashboard} exact path="/" />
    <SessionRoute component={Invite} path="/invite" />
    <SessionRoute component={Activities} path="/activities" />
    <TrustedRoute
      component={TrustRevokeConfirm}
      path="/trust/revoke/:address"
    />
    <TrustedRoute component={TrustConfirm} path="/trust/:address" />
    <TrustedRoute component={Trust} path="/trust" />
    <TrustedRoute component={SendConfirm} path="/send/:address" />
    <TrustedRoute component={Send} path="/send" />
    <TrustedRoute component={Search} path="/search" />
    <SessionRoute component={ReceiveShare} path="/receive/share" />
    <SessionRoute component={Receive} path="/receive" />
    <SessionRoute component={Profile} path="/profile/:address" />
    <TrustedRoute component={SettingsKeysAdd} path="/settings/keys/add" />
    <SessionRoute component={SettingsKeysExport} path="/settings/keys/export" />
    <SessionRoute component={SettingsKeysContainer} path="/settings/keys" />
    <SessionRoute component={SettingsShare} path="/settings/share" />
    <SessionRoute component={Settings} path="/settings" />
    <OnboardingRoute component={AccountCreateContainer} path="/welcome/new" />
    <OnboardingRoute component={AccountConnect} path="/welcome/connect" />
    <OnboardingRoute component={AccountImport} path="/welcome/seed" />
    <OnboardingRoute component={Welcome} path="/welcome" />
    <Route component={NotFound} />
  </Switch>
);

SessionContainer.propTypes = {
  component: PropTypes.elementType.isRequired,
  isSafeRequired: PropTypes.bool,
  isSessionRequired: PropTypes.bool,
};

OnboardingRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

SessionRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

TrustedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};

TutorialContainer.propTypes = {
  componentFinal: PropTypes.elementType.isRequired,
  componentTutorial: PropTypes.elementType.isRequired,
  exitPath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Routes;
