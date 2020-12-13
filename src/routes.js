import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Activities from '~/views/Activities';
import Dashboard from '~/views/Dashboard';
import Error from '~/views/Error';
import Login from '~/views/Login';
import Onboarding from '~/views/Onboarding';
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
export const VALIDATION_PATH = '/';
export const VALIDATION_SHARE_PATH = '/validation/share';
export const WELCOME_PATH = '/';

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
      {/* Handle private routes */}
      {app.isAuthorized && (
        <>
          `
          <Route component={Settings} exact path={SETTINGS_PATH} />
          <Route component={SeedPhrase} exact path={SEED_PHRASE_PATH} />
          <Route
            component={ValidationShare}
            exact
            path={VALIDATION_SHARE_PATH}
          />
          <Route component={Validation} exact path={VALIDATION_PATH} />
          {app.isValidated && (
            <>
              <Route component={Share} exact path={SHARE_PATH} />
              <Route component={Profile} exact path={PROFILE_PATH} />
              <Route component={QRGenerator} exact path={QR_GENERATOR_PATH} />
              <Route component={SendConfirm} exact path={SEND_CONFIRM_PATH} />
              <Route component={Send} exact path={SEND_PATH} />
              <Route component={Search} exact path={SEARCH_PATH} />
              <Route component={Activities} exact path={ACTIVITIES_PATH} />
              <Route component={Dashboard} exact path={DASHBOARD_PATH} />
              <Route render={() => <Redirect to={DASHBOARD_PATH} />} />
            </>
          )}
          <Route render={() => <Redirect to={VALIDATION_PATH} />} />
        </>
      )}
      <Route
        exact
        path={ONBOARDING_PATH}
        render={() => (
          <TutorialContainer
            componentFinal={Onboarding}
            componentTutorial={TutorialOnboarding}
            exitPath={WELCOME_PATH}
            name={ACCOUNT_CREATE}
          />
        )}
      />
      <Route component={Login} exact path={LOGIN_PATH} />
      <Route component={Welcome} exact path={WELCOME_PATH} />
      <Route render={() => <Redirect to={WELCOME_PATH} />} />
    </Switch>
  );
};

TutorialContainer.propTypes = {
  componentFinal: PropTypes.elementType.isRequired,
  componentTutorial: PropTypes.elementType.isRequired,
  exitPath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Routes;
