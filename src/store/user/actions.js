import { Typography } from '@mui/material';
import React from 'react';

import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import ActionTypes from '~/store/user/types';
import logError from '~/utils/debug';

export function initializeUser() {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    try {
      const migrationStatus = await core.user.getProfileMigrationConsent(
        safe.currentAccount,
      );

      dispatch({
        type: ActionTypes.USER_MIGRATION_UPDATE,
        meta: {
          isMigrationAccepted:
            migrationStatus !== null ? migrationStatus : false,
        },
      });
    } catch (error) {
      logError(error);
    }
  };
}

export function updateUserMigration(isMigrateData) {
  return async (dispatch, getState) => {
    const { safe } = getState();

    if (!safe.currentAccount) {
      return;
    }

    try {
      const updateMigration = await core.user.updateProfileMigrationConsent(
        safe.currentAccount,
        isMigrateData,
      );

      if (updateMigration) {
        dispatch({
          type: ActionTypes.USER_MIGRATION_UPDATE,
          meta: {
            isMigrationAccepted: isMigrateData,
          },
        });
        dispatch(
          notify({
            text: (
              <Typography classes={{ root: 'body4_white' }} variant="body4">
                {translate('MigrateYourProfile.confirmationMsg')}
              </Typography>
            ),
            type: NotificationsTypes.SUCCESS,
          }),
        );
        /* eslint-disable no-console */
      }
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('MigrateYourProfile.errorMsg')}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };
}
