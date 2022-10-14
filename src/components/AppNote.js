import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import HumbleAlert from '~/components/HumbleAlert';

const useStyles = makeStyles(() => ({
  appNoteContainer: {
    position: 'relative',
  },
}));

const notification = {
  validation: process.env.USER_NOTIFICATION_VALIDATION,
  dashboard: process.env.USER_NOTIFICATION_DASHBOARD,
  default: process.env.USER_NOTIFICATION,
  error: process.env.USER_NOTIFICATION_ERROR,
  login: process.env.USER_NOTIFICATION_LOGIN,
  onboarding: process.env.USER_NOTIFICATION_ONBOARDING,
};

const AppNote = ({ messageVersion }) => {
  const classes = useStyles();
  const choice = messageVersion ? messageVersion : 'default';
  const message = notification[choice]
    ? notification[choice]
    : notification['default'];

  return message ? (
    <Box className={classes.appNoteContainer} my={2}>
      <HumbleAlert>{message}</HumbleAlert>
    </Box>
  ) : null;
};

AppNote.propTypes = {
  messageVersion: PropTypes.string,
};

export default AppNote;
