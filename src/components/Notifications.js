import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { closeSnackbar } from 'notistack';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import translate from '~/services/locale';
import { removeNotification } from '~/store/notifications/actions';
import {
  IconAlert,
  IconBrowser,
  IconCrossInCircle,
  IconOffline,
  IconOkTick,
  IconPartySuccess,
  IconRefresh,
  IconTriangleWarning,
  iconSelector,
} from '~/styles/icons';

let displayed = [];

const useStyles = makeStyles((theme) => ({
  iconTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    lineHeight: '18px',
  },
  iconContainer: {
    marginRight: '18px',
  },
}));

const CloseButton = ({ notificationId, onClickHandler }) => {
  return (
    <IconButton
      color="inherit"
      onClick={() => {
        onClickHandler(notificationId);
      }}
    >
      <IconCrossInCircle />
    </IconButton>
  );
};

const Notifications = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.notifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    messages.forEach(
      ({ id, text, icon, action, lifetime, type, isDismissed }) => {
        if (isDismissed) {
          closeSnackbar(id);
          return;
        }

        const actionElement = action ? (
          action
        ) : (
          <CloseButton
            notificationId={id}
            onClickHandler={() => closeSnackbar(id)}
          />
        );

        // Do nothing if snackbar is already displayed
        if (displayed.includes(id)) {
          return;
        }

        console.log('text in useEffect', text);
        console.log('icon in useEffect', icon);

        const IconElement = iconSelector(icon);
        const notificationText = (
          <Box className={classes.iconTextContainer}>
            <Box className={classes.iconContainer}>
              <IconElement />
            </Box>
            {text}
          </Box>
        );

        // const displayText = TextElement(icon, text);
        // Display snackbar using notistack
        enqueueSnackbar(notificationText, {
          action: actionElement,
          key: id,
          autoHideDuration: lifetime,
          icon,
          variant: type,
          onExited: (event, notificationId) => {
            // Remove this snackbar from redux store
            dispatch(removeNotification(notificationId));
            removeDisplayed(notificationId);
          },
        });

        // Keep track of snackbars that we've displayed
        storeDisplayed(id);
      },
    );
  }, [dispatch, enqueueSnackbar, closeSnackbar, messages]);

  return null;
};

export default Notifications;
