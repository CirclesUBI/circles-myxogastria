import ActionTypes from '~/store/app/types';
import resolveUsernames from '~/services/username';
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
import { checkOnboardingState } from '~/store/onboarding/actions';
import {
  checkSafeState,
  initializeSafe,
  resetSafe,
} from '~/store/safe/actions';
import { checkTrustState } from '~/store/trust/actions';
import {
  initializeTutorials,
  resetAllTutorials,
} from '~/store/tutorial/actions';
import { initializeWallet, burnWallet } from '~/store/wallet/actions';
import { setUser } from '~/services/sentry';

const CONNECTION_CHECK_FREQUENCY = 100;
const CONNECTION_MAX_ATTEMPTS = 50;

export function initializeApp() {
  return async (dispatch) => {
    dispatch({
      type: ActionTypes.APP_INITIALIZE,
    });

    // Connect to Blockchain via middleware
    dispatch({
      type: ActionTypes.APP_CONNECT,
    });

    dispatch(showSpinnerOverlay());

    try {
      await dispatch(waitForConnection());
    } catch {
      dispatch({
        type: ActionTypes.APP_INITIALIZE_ERROR,
        meta: {
          isCritical: false,
        },
      });

      dispatch(hideSpinnerOverlay());

      return;
    }

    // Initialize and gather important app states (auth etc.)
    try {
      await dispatch(initializeTutorials());
      await dispatch(initializeWallet());
      await dispatch(initializeSafe());
      await dispatch(initializeActivities());
      await dispatch(checkAuthState());

      // Check only once in the beginning if Safe is funded (since this is an
      // edge-case and we don't want to waste requests)
      await dispatch(checkOnboardingState());

      // Already check for older activities to see if we can hide the "Load
      // More" button
      await dispatch(loadMoreActivities());

      // Check for additional states ...
      await dispatch(checkAppState());

      dispatch({
        type: ActionTypes.APP_INITIALIZE_SUCCESS,
      });

      dispatch(hideSpinnerOverlay());
    } catch (error) {
      dispatch({
        type: ActionTypes.APP_INITIALIZE_ERROR,
        meta: {
          isCritical: true,
        },
      });

      dispatch(hideSpinnerOverlay());

      throw error;
    }
  };
}

export function checkAppState() {
  return async (dispatch, getState) => {
    const { app, safe } = getState();

    if (app.isError || !app.isConnected) {
      return;
    }

    // Onboarding / validation states
    await dispatch(checkSafeState());
    await dispatch(checkTrustState());

    // In-app states
    await dispatch(checkTokenState());
    await dispatch(checkCurrentBalance());
    await dispatch(checkFinishedActivities());
    await dispatch(checkPendingActivities());

    // Auth and validation state
    await dispatch(checkAuthState());

    // Sentry: Give additional debug information
    const safeAddress = safe.pendingAddress || safe.currentAccount;
    resolveUsernames([safeAddress]).then((result) => {
      setUser(safeAddress, result[safeAddress]);
    });
  };
}

export function checkAuthState() {
  return (dispatch, getState) => {
    const { safe, wallet, app, token } = getState();

    const isAuthorized =
      (!!safe.currentAccount || !!safe.pendingAddress) && !!wallet.address;
    const isValidated = !!token.address && !safe.pendingAddress;

    if (isAuthorized !== app.isAuthorized || isValidated !== app.isValidated) {
      dispatch({
        type: ActionTypes.APP_UPDATE_AUTH,
        meta: {
          isAuthorized,
          isValidated,
        },
      });
    }
  };
}

export function waitForConnection() {
  return async (dispatch, getState) => {
    let attempt = 1;
    // .. wait until connection was successful
    return await new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const { app } = getState();

        if (app.isConnected) {
          clearInterval(interval);
          resolve();
        } else {
          attempt += 1;
          if (attempt > CONNECTION_MAX_ATTEMPTS) {
            reject(new Error('Connection failed'));
          }
        }
      }, CONNECTION_CHECK_FREQUENCY);
    });
  };
}

export function burnApp() {
  return async (dispatch) => {
    await dispatch(burnWallet());
    await dispatch(resetSafe());
    await dispatch(checkAuthState());
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
