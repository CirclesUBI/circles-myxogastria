import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import theme, { colors } from '../styles/theme';

import HumbleAlert from '~/components/HumbleAlert';

const useStyles = makeStyles(() => ({
  appNoteContainer: {
    position: 'relative',
  },
}));

const notification = {
  validation: {
    color: process.env.USER_NOTIFICATION_VALIDATION_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_VALIDATION_ICON,
    iconColor: process.env.USER_NOTIFICATION_VALIDATION_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_VALIDATION,
  },
  dashboard: {
    color: process.env.USER_NOTIFICATION_DASHBOARD_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_DASHBOARD_ICON,
    iconColor: process.env.USER_NOTIFICATION_DASHBOARD_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_DASHBOARD,
  },
  default: {
    color:
      process.env.USER_NOTIFICATION_BACKGROUND_COLOR ||
      theme.custom.colors.fountainBlue,
    icon: process.env.USER_NOTIFICATION_ICON || 'IconAlert',
    iconColor: process.env.USER_NOTIFICATION_ICON_COLOR || colors.whiteAlmost,
    text: process.env.USER_NOTIFICATION,
  },
  error: {
    color: process.env.USER_NOTIFICATION_ERROR_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_ERROR_ICON,
    iconColor: process.env.USER_NOTIFICATION_ERROR_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_ERROR,
  },
  login: {
    color: process.env.USER_NOTIFICATION_LOGIN_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_LOGIN_ICON,
    iconColor: process.env.USER_NOTIFICATION_LOGIN_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_LOGIN,
  },
  onboarding: {
    color: process.env.USER_NOTIFICATION_ONBOARDING_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_ONBOARDING_ICON,
    iconColor: process.env.USER_NOTIFICATION_ONBOARDING_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_ONBOARDING,
  },
};

const AppNote = ({ messageVersion }) => {
  const classes = useStyles();
  const choice = messageVersion ? messageVersion : 'default';
  const message = notification[choice].text
    ? notification[choice].text
    : notification['default'].text;
  const color = notification[choice].color
    ? notification[choice].color
    : notification['default'].color;
  const iconColor = notification[choice].iconColor
    ? notification[choice].iconColor
    : notification['default'].iconColor;
  const icon = notification[choice].icon
    ? notification[choice].icon
    : notification['default'].icon;

  return message ? (
    <Box className={classes.appNoteContainer} my={2}>
      <HumbleAlert color={color} icon={icon} iconColor={iconColor}>
        {message}
      </HumbleAlert>
    </Box>
  ) : null;
};

AppNote.propTypes = {
  messageVersion: PropTypes.string,
};

export default AppNote;
