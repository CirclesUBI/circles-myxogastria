import ActionTypes from '~/store/tutorial/types';
import { getTutorial, setTutorial, resetTutorials } from '~/services/tutorial';

export const ACCOUNT_CREATE = 'accountCreate';
export const ORGANIZATION_CREATE = 'settingsKeys';
export const SETTINGS_KEYS = 'settingsKeys';

const TUTORIALS = [ACCOUNT_CREATE, ORGANIZATION_CREATE, SETTINGS_KEYS];

export function initializeTutorials() {
  return (dispatch) => {
    TUTORIALS.forEach((name) => {
      dispatch({
        type: ActionTypes.TUTORIAL_UPDATE,
        meta: {
          name,
          isFinished: getTutorial(name),
        },
      });
    });
  };
}

export function resetAllTutorials() {
  return (dispatch) => {
    resetTutorials();
    dispatch(initializeTutorials());
  };
}

export function finishTutorial(name) {
  setTutorial(name, true);

  return {
    type: ActionTypes.TUTORIAL_UPDATE,
    meta: {
      name,
      isFinished: true,
    },
  };
}

export function resetTutorial(name) {
  setTutorial(name, false);

  return {
    type: ActionTypes.TUTORIAL_UPDATE,
    meta: {
      name,
      isFinished: false,
    },
  };
}
