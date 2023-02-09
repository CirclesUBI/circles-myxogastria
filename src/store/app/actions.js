import { initializeLastReceivedTransaction } from '~/services/activity';
import { removeSafeVersion } from '~/services/safe';
import { setUser } from '~/services/sentry';
import resolveUsernames from '~/services/username';
import {
  initializeActivities,
  resetActivities,
} from '~/store/activity/actions';
import ActionTypes from '~/store/app/types';
import { checkOnboardingState } from '~/store/onboarding/actions';
import {
  checkSharedSafeState,
  initializeSafe,
  resetSafe,
  resetSafeVersion,
  switchCurrentAccount,
} from '~/store/safe/actions';
import { checkTokenState, resetToken } from '~/store/token/actions';
import {
  initializeTutorials,
  resetAllTutorials,
} from '~/store/tutorial/actions';
import { burnWallet, initializeWallet } from '~/store/wallet/actions';
import { formatErrorMessage } from '~/utils/debug';

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

    // Initialize and gather important app states (auth etc.)
    try {
      await dispatch(initializeTutorials());
      await dispatch(initializeWallet());
      await dispatch(initializeSafe());
      await dispatch(initializeActivities());
      initializeLastReceivedTransaction();
      await dispatch(checkAuthState());

      // Check only once in the beginning if Safe is funded (since this is an
      // edge-case and we don't want to waste requests)
      await dispatch(checkOnboardingState());

      // Check for additional states ...
      await dispatch(checkAppState());

      dispatch({
        type: ActionTypes.APP_INITIALIZE_SUCCESS,
      });

      dispatch(hideSpinnerOverlay());
    } catch (error) {
      const errorMessage = formatErrorMessage(error);

      dispatch({
        type: ActionTypes.APP_INITIALIZE_ERROR,
        meta: {
          errorMessage,
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

    if (app.isError) {
      return;
    }

    // Onboarding / validation states
    await dispatch(checkSharedSafeState());

    // In-app states
    await dispatch(checkTokenState());

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
    const isValidated =
      (!!token.address || safe.isOrganization) && !safe.pendingAddress;

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

export function switchAccount(address) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.accounts.includes(address)) {
      throw new Error('Selected address is not an option');
    }

    await dispatch(switchCurrentAccount(address));
    await removeSafeVersion();
    await dispatch(resetSafeVersion());
    await dispatch(resetToken());
    await dispatch(resetActivities({ isClearingStorage: false }));
    await dispatch(initializeActivities());
    await dispatch(checkAppState());
  };
}

export function burnApp() {
  return async (dispatch) => {
    dispatch(showSpinnerOverlay());
    await dispatch(resetSafeVersion());
    await removeSafeVersion();
    await dispatch(burnWallet());
    await dispatch(resetSafe());
    await dispatch(checkAuthState());
    await dispatch(resetToken());
    await dispatch(resetActivities());
    await dispatch(resetAllTutorials());

    // Redirect to home and then refresh page
    window.location.href = process.env.BASE_PATH;
    window.setTimeout(() => {
      window.location.reload();
    }, 1000);
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
