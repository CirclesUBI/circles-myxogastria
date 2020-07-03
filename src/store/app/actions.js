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
  loadMoreActivities,
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
      dispatch(initializeLocale());
      dispatch(initializeTutorials());
      dispatch(initializeWallet());
      dispatch(initializeSafe());
      dispatch(initializeActivities());
      dispatch(checkAuthState());

      // Check only once in the beginning if Safe is funded (since this is an
      // edge-case and we don't want to waste requests)
      dispatch(checkOnboardingState());

      // Already check for older activities to see if we can hide the "Load
      // More" button
      dispatch(loadMoreActivities());

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
    dispatch(checkSafeState());
    dispatch(checkTrustState());
    dispatch(checkAuthState());

    // In-app states
    dispatch(checkTokenState());
    dispatch(checkCurrentBalance());
    dispatch(checkFinishedActivities());
    dispatch(checkPendingActivities());

    // Debug information
    resolveUsernames([safe.address]).then((result) => {
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
    dispatch(burnWallet());

    dispatch(resetSafe());
    dispatch(resetToken());
    dispatch(resetActivities());
    dispatch(resetAllTutorials());

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
