import ActionTypes from '~/store/app/types';
import { checkTrustState } from '~/store/trust/actions';
import { initializeWallet } from '~/store/wallet/actions';

import { checkOnboardingState } from '~/store/onboarding/actions';
import { checkSafeState, initializeSafe } from '~/store/safe/actions';

export function initializeApp() {
  return async dispatch => {
    dispatch({
      type: ActionTypes.APP_INITIALIZE,
    });

    await dispatch(initializeWallet());
    await dispatch(initializeSafe());
    await dispatch(checkAppState());

    dispatch({
      type: ActionTypes.APP_INITIALIZE_READY,
    });
  };
}

export function checkAppState() {
  return async dispatch => {
    await dispatch(checkSafeState());
    await dispatch(checkTrustState());
    await dispatch(checkOnboardingState());
  };
}
