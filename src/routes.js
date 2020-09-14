import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AccountConnect from '~/views/AccountConnect';
import AccountImport from '~/views/AccountImport';
import Activities from '~/views/Activities';
import Dashboard from '~/views/Dashboard';
import Error from '~/views/Error';
import Invite from '~/views/Invite';
import NotFound from '~/views/NotFound';
import Onboarding from '~/views/Onboarding';
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
import TutorialOnboarding from '~/views/TutorialOnboarding';
import TutorialSettingsKeys from '~/views/TutorialSettingsKeys';
import Validation from '~/views/Validation';
import ValidationShare from '~/views/ValidationShare';
import Welcome from '~/views/Welcome';
import { ACCOUNT_CREATE, SETTINGS_KEYS } from '~/store/tutorial/actions';

export const DASHBOARD_PATH = '/';
export const ONBOARDING_PATH = '/welcome/onboarding';
export const WELCOME_PATH = '/welcome';

const SessionContainer = ({
  component: Component,
  isAuthorizationRequired = false,
  isValidationRequired = false,
}) => {
  const app = useSelector((state) => state.app);
  let isValid = true;

  // Check if user has a valid session ..
  //
  // 1. Do we have (predicted) Safe address?
  // 2. Do we have Wallet?
  if (isAuthorizationRequired && !app.isAuthorized) {
    isValid = false;
  }

  if (!isAuthorizationRequired && app.isAuthorized) {
    isValid = false;
  }

  // Check if user is validated ...
  //
  // 1. Is the Safe deployed (nonce is not set)?
  // 2. Do we have a Token address (Token contract is deployed)?
  if (isValidationRequired && isAuthorizationRequired && !app.isValidated) {
    isValid = false;
  }

  if (!isValidationRequired && isAuthorizationRequired && app.isValidated) {
    isValid = false;
  }

  if (isValid) {
    return <Component />;
  }

  // Redirect to fallback routes ..
  if (app.isAuthorized) {
    if (isValidationRequired) {
      return <Redirect to="/validation" />;
    }

    return <Redirect to={DASHBOARD_PATH} />;
  }

  return <Redirect to={WELCOME_PATH} />;
};

// Containers for routes with different permissions

const OnboardingRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} />
    </Route>
  );
};

const SessionRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer component={component} isAuthorizationRequired />
    </Route>
  );
};

const TrustedRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer
        component={component}
        isAuthorizationRequired
        isValidationRequired
      />
    </Route>
  );
};

// Containers for Tutorials

const TutorialContainer = (props) => {
  const [redirect, setRedirect] = useState(false);
  const { isFinished } = useSelector((state) => {
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

const OnboardingContainer = () => {
  return (
    <TutorialContainer
      componentFinal={Onboarding}
      componentTutorial={TutorialOnboarding}
      exitPath={WELCOME_PATH}
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

// Routes

const Routes = () => {
  const location = useLocation();
  const app = useSelector((state) => state.app);

  // Did something bad happen?
  if (app.isError) {
    return <Error />;
  }

  // Do not do anything yet when we are not ready
  if (!app.isReady || app.isLoading) {
    return null;
  }

  return (
    <Switch location={location}>
      <TrustedRoute component={Dashboard} exact path={DASHBOARD_PATH} />
      <SessionRoute component={ValidationShare} path="/validation/share" />
      <SessionRoute component={Validation} path="/validation" />
      <TrustedRoute component={Invite} path="/invite" />
      <TrustedRoute component={Activities} path="/activities" />
      <TrustedRoute
        component={TrustRevokeConfirm}
        path="/trust/revoke/:address"
      />
      <TrustedRoute component={TrustConfirm} path="/trust/:address" />
      <TrustedRoute component={Trust} path="/trust" />
      <TrustedRoute component={SendConfirm} path="/send/:address" />
      <TrustedRoute component={Send} path="/send" />
      <TrustedRoute component={Search} path="/search" />
      <TrustedRoute component={ReceiveShare} path="/receive/share" />
      <TrustedRoute component={Receive} path="/receive" />
      <TrustedRoute component={Profile} path="/profile/:address" />
      <TrustedRoute component={SettingsKeysAdd} path="/settings/keys/add" />
      <TrustedRoute
        component={SettingsKeysExport}
        path="/settings/keys/export"
      />
      <TrustedRoute component={SettingsKeysContainer} path="/settings/keys" />
      <TrustedRoute component={SettingsShare} path="/settings/share" />
      <TrustedRoute component={Settings} path="/settings" />
      <OnboardingRoute component={OnboardingContainer} path={ONBOARDING_PATH} />
      <OnboardingRoute component={AccountConnect} path="/welcome/connect" />
      <OnboardingRoute component={AccountImport} path="/welcome/seed" />
      <OnboardingRoute component={Welcome} path={WELCOME_PATH} />
      <Route component={NotFound} />
    </Switch>
  );
};

SessionContainer.propTypes = {
  component: PropTypes.elementType.isRequired,
  isAuthorizationRequired: PropTypes.bool,
  isValidationRequired: PropTypes.bool,
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
