import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Activities from '~/views/Activities';
import Dashboard from '~/views/Dashboard';
import DashboardOrganization from '~/views/DashboardOrganization';
import Error from '~/views/Error';
import Login from '~/views/Login';
import NotFound from '~/views/NotFound';
import Onboarding from '~/views/Onboarding';
import OnboardingOrganization from '~/views/OnboardingOrganization';
import OrganizationMembers from '~/views/OrganizationMembers';
import OrganizationMembersAdd from '~/views/OrganizationMembersAdd';
import Profile from '~/views/Profile';
import QRGenerator from '~/views/QRGenerator';
import Search from '~/views/Search';
import SeedPhrase from '~/views/SeedPhrase';
import Send from '~/views/Send';
import SendConfirm from '~/views/SendConfirm';
import Settings from '~/views/Settings';
import Share from '~/views/Share';
import TutorialOnboarding from '~/views/TutorialOnboarding';
import Validation from '~/views/Validation';
import ValidationLock from '~/views/ValidationLock';
import ValidationShare from '~/views/ValidationShare';
import Welcome from '~/views/Welcome';
import { ACCOUNT_CREATE } from '~/store/tutorial/actions';

// Routes in Drawer component
export const MY_PROFILE_PATH = '/profile';

// Main routes
export const ACTIVITIES_PATH = '/activities';
export const DASHBOARD_PATH = '/';
export const LOGIN_PATH = '/welcome/login';
export const ONBOARDING_PATH = '/welcome/onboarding';
export const ORGANIZATION_MEMBERS_ADD_PATH = '/organization/members/add';
export const ORGANIZATION_MEMBERS_PATH = '/organization/members';
export const ORGANIZATION_PATH = '/organization';
export const PROFILE_PATH = '/profile/:address';
export const QR_GENERATOR_PATH = '/organization/qr';
export const SEARCH_PATH = '/search';
export const SEED_PHRASE_PATH = '/seedphrase';
export const SEND_CONFIRM_PATH = '/send/:address(0x[0-9a-fA-f]{40})';
export const SEND_PATH = '/send';
export const SETTINGS_PATH = '/settings';
export const SHARE_PATH = '/share';
export const VALIDATION_PATH = '/validation';
export const VALIDATION_SHARE_PATH = '/validation/share';
export const WELCOME_PATH = '/welcome';

const SessionContainer = ({
  component: Component,
  isAuthorizationRequired = false,
  isValidationRequired = false,
  isOrganizationRequired = false,
}) => {
  const { app, safe } = useSelector((state) => state);
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

  // Check if user is an organization ..
  if (isOrganizationRequired && !safe.isOrganization) {
    isValid = false;
  }

  if (isValid) {
    return <Component />;
  }

  // Redirect to fallback routes ..
  if (app.isAuthorized) {
    if (isValidationRequired) {
      return <Redirect to={VALIDATION_PATH} />;
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

const OrganizationRoute = ({ component, path }) => {
  return (
    <Route path={path}>
      <SessionContainer
        component={component}
        isAuthorizationRequired
        isOrganizationRequired
        isValidationRequired
      />
    </Route>
  );
};

// Containers for organizations

const OnboardingOrganizationContainer = () => {
  const safe = useSelector((state) => state.safe);
  if (safe.isOrganization) {
    return <Redirect to={DASHBOARD_PATH} />;
  }
  return <OnboardingOrganization />;
};

const DashboardContainer = () => {
  const safe = useSelector((state) => state.safe);
  if (safe.isOrganization) {
    return <DashboardOrganization />;
  }
  return <Dashboard />;
};

// Containers for tutorials

const TutorialContainer = (props) => {
  const [redirect, setRedirect] = useState(false);
  const { isFinished } = useSelector((state) => {
    return state.tutorial[props.name];
  });

  if (redirect) {
    return <Redirect push to={props.exitPath} />;
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

const TutorialOnboardingContainer = () => {
  return (
    <TutorialContainer
      componentFinal={Onboarding}
      componentTutorial={TutorialOnboarding}
      exitPath={WELCOME_PATH}
      name={ACCOUNT_CREATE}
    />
  );
};

// Routes

const Routes = () => {
  const location = useLocation();
  const { app, safe } = useSelector((state) => state);

  // Did something bad happen?
  if (app.isError) {
    return <Error />;
  }

  // Do not do anything yet when we are not ready
  if (!app.isReady) {
    return null;
  }

  // Show locked view when Safe is being deployed
  if (safe.pendingIsLocked) {
    return <ValidationLock />;
  }

  return (
    <Switch location={location}>
      <Route component={Settings} exact path={SETTINGS_PATH} />
      <OnboardingRoute component={Welcome} exact path={WELCOME_PATH} />
      <OnboardingRoute
        component={TutorialOnboardingContainer}
        exact
        path={ONBOARDING_PATH}
      />
      <OnboardingRoute component={Login} exact path={LOGIN_PATH} />
      <SessionRoute component={Validation} exact path={VALIDATION_PATH} />
      <SessionRoute
        component={ValidationShare}
        exact
        path={VALIDATION_SHARE_PATH}
      />
      <TrustedRoute component={SendConfirm} exact path={SEND_CONFIRM_PATH} />
      <TrustedRoute component={Send} exact path={SEND_PATH} />
      <TrustedRoute component={SeedPhrase} exact path={SEED_PHRASE_PATH} />
      <TrustedRoute component={Share} exact path={SHARE_PATH} />
      <TrustedRoute component={Profile} exact path={PROFILE_PATH} />
      <TrustedRoute component={Activities} exact path={ACTIVITIES_PATH} />
      <TrustedRoute component={QRGenerator} exact path={QR_GENERATOR_PATH} />
      <TrustedRoute component={Search} exact path={SEARCH_PATH} />
      <OrganizationRoute
        component={OrganizationMembersAdd}
        exact
        path={ORGANIZATION_MEMBERS_ADD_PATH}
      />
      <OrganizationRoute
        component={OrganizationMembers}
        exact
        path={ORGANIZATION_MEMBERS_PATH}
      />
      <TrustedRoute
        component={OnboardingOrganizationContainer}
        exact
        path={ORGANIZATION_PATH}
      />
      <TrustedRoute component={DashboardContainer} path={DASHBOARD_PATH} />
      <Route component={NotFound} />
    </Switch>
  );
};

SessionContainer.propTypes = {
  component: PropTypes.elementType.isRequired,
  isAuthorizationRequired: PropTypes.bool,
  isOrganizationRequired: PropTypes.bool,
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

OrganizationRoute.propTypes = {
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
