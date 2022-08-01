import ActionTypes from '~/store/userInputsData/types';

export function updateUsernameUserInputsData(username) {
  return {
    type: ActionTypes.USERINPUTSDATA_USERNAME_UPDATE,
    meta: {
      username,
    },
  };
}

export function updateAvatarUrlUserInputsData(avatarUrl) {
  return {
    type: ActionTypes.USERINPUTSDATA_AVATARURL_UPDATE,
    meta: {
      avatarUrl,
    },
  };
}
