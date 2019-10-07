import ActionTypes from '~/store/app/types';
import { checkOnboardingState } from '~/store/onboarding/actions';
import { checkTokenState, checkCurrentBalance } from '~/store/token/actions';
import { checkTrustState } from '~/store/trust/actions';
import { initializeLocale } from '~/store/locale/actions';
import { initializeWallet, burnWallet } from '~/store/wallet/actions';

import {
  checkSafeState,
  initializeSafe,
  resetSafe,
} from '~/store/safe/actions';

export function initializeApp() {
  return async dispatch => {
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
      await dispatch(initializeWallet());
      await dispatch(initializeSafe());
      await dispatch(checkAppState());

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
    const { app } = getState();

    if (!app.isReady || app.isError) {
      return;
    }

    // Onboarding / permission states
    await dispatch(checkSafeState());
    await dispatch(checkTrustState());
    await dispatch(checkOnboardingState());

    // In-app states
    await dispatch(checkTokenState());
    await dispatch(checkCurrentBalance());
  };
}

export function burnApp() {
  return async dispatch => {
    await dispatch(burnWallet());
    await dispatch(resetSafe());

    window.location.reload();
  };
}
