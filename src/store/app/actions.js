import ActionTypes from '~/store/app/types';
import resolveUsernames from '~/services/username';
import { checkOnboardingState } from '~/store/onboarding/actions';
import { checkTrustState } from '~/store/trust/actions';
import { initializeLocale } from '~/store/locale/actions';
import { initializeWallet, burnWallet } from '~/store/wallet/actions';
import { setUser } from '~/services/sentry';

import {
  initializeTutorials,
  resetAllTutorials,
} from '~/store/tutorial/actions';

import {
  checkCurrentBalance,
  checkTokenState,
  resetToken,
} from '~/store/token/actions';

import {
  checkFinishedActivities,
  checkPendingActivities,
  initializeActivities,
  resetActivities,
} from '~/store/activity/actions';

import {
  checkSafeState,
  initializeSafe,
  resetSafe,
} from '~/store/safe/actions';

export function initializeApp() {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.APP_INITIALIZE,
    });

    // Connect to Blockchain via middleware
    dispatch({
      type: ActionTypes.APP_CONNECT,
    });

    // Initialize and gather important app states (auth etc.)
    try {
      await dispatch(initializeLocale());
      await dispatch(initializeTutorials());
      await dispatch(initializeWallet());
      await dispatch(initializeSafe());
      await dispatch(initializeActivities());
      await dispatch(checkAuthState());

      dispatch({
        type: ActionTypes.APP_INITIALIZE_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.APP_INITIALIZE_ERROR,
      });

      throw error;
    }
  };
}

export function checkAppState() {
  return async (dispatch, getState) => {
    const { app, safe } = getState();

    if (!app.isReady || app.isError || !app.isConnected) {
      return;
    }

    // Onboarding / permission states
    await dispatch(checkSafeState());
    await dispatch(checkTrustState());
    await dispatch(checkOnboardingState());
    await dispatch(checkAuthState());

    // In-app states
    await dispatch(checkTokenState());
    await dispatch(checkCurrentBalance());
    await dispatch(checkFinishedActivities());
    await dispatch(checkPendingActivities());

    // Debug information
    await resolveUsernames([safe.address]).then((result) => {
      setUser(safe.address, result[safe.address]);
    });
  };
}

export function checkAuthState() {
  return async (dispatch, getState) => {
    const { safe, wallet, app } = getState();
    const isValid = safe.address && wallet.address;

    if (isValid && !app.isAuthorized) {
      dispatch({
        type: ActionTypes.APP_AUTHORIZE,
      });
    } else if (!isValid && app.isAuthorized) {
      dispatch({
        type: ActionTypes.APP_UNAUTHORIZE,
      });
    }
  };
}

export function burnApp() {
  return async (dispatch) => {
    await dispatch(burnWallet());

    await dispatch(resetSafe());
    await dispatch(resetToken());
    await dispatch(resetActivities());
    await dispatch(resetAllTutorials());

    window.location.reload();
  };
}

export function showSpinnerOverlay() {
  return {
    type: ActionTypes.APP_SPINNER_SHOW,
  };
}

export function hideSpinnerOverlay() {
  return {
    type: ActionTypes.APP_SPINNER_HIDE,
  };
}
