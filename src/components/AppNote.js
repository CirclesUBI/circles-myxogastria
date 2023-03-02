import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import theme, { colors } from '../styles/theme';

import HumbleAlert from '~/components/HumbleAlert';

const DEFAULT_ALERT_COLOR = theme.custom.colors.fountainBlueLighter;
const DEFAULT_ICON_COLOR = colors.whiteAlmost;
const DEFAULT_ICON = 'IconBrowser';

const useStyles = makeStyles(() => ({
  appNoteContainer: {
    position: 'relative',
  },
}));

const notification = {
  dashboard: {
    color: process.env.USER_NOTIFICATION_DASHBOARD_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_DASHBOARD_ICON,
    iconColor: process.env.USER_NOTIFICATION_DASHBOARD_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_DASHBOARD,
  },
  default: {
    color: process.env.USER_NOTIFICATION_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_ICON || DEFAULT_ICON,
    iconColor: process.env.USER_NOTIFICATION_ICON_COLOR,
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
  validation: {
    color: process.env.USER_NOTIFICATION_VALIDATION_BACKGROUND_COLOR,
    icon: process.env.USER_NOTIFICATION_VALIDATION_ICON,
    iconColor: process.env.USER_NOTIFICATION_VALIDATION_ICON_COLOR,
    text: process.env.USER_NOTIFICATION_VALIDATION,
  },
};

const colorSelector = (icon) => {
  switch (icon) {
    case 'blue':
      return DEFAULT_ALERT_COLOR;
    default:
      return DEFAULT_ALERT_COLOR;
  }
};

const iconColorSelector = (icon) => {
  switch (icon) {
    case 'white':
      return DEFAULT_ICON_COLOR;
    default:
      return DEFAULT_ICON_COLOR;
  }
};

const AppNote = ({ messageVersion }) => {
  const classes = useStyles();
  const choice = messageVersion ? messageVersion : 'default';
  const message = notification[choice].text || notification['default'].text;
  const color = notification[choice].color || notification['default'].color;
  const iconColor =
    notification[choice].iconColor || notification['default'].iconColor;
  const icon = notification[choice].icon || notification['default'].icon;

  return message ? (
    <Box className={classes.appNoteContainer} my={2}>
      <HumbleAlert
        color={colorSelector(color)}
        icon={icon}
        iconColor={iconColorSelector(iconColor)}
        parseHtml
      >
        {message}
      </HumbleAlert>
    </Box>
  ) : null;
};

AppNote.propTypes = {
  messageVersion: PropTypes.string,
};

export default AppNote;
