import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { closeSnackbar } from 'notistack';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeNotification } from '~/store/notifications/actions';

let displayed = [];

const useStyles = makeStyles((theme) => ({
  notificationAction: {
    display: 'flex',
    background: 'red',
  },
}));

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
      ({ id, text, icon, isClosedBtn, lifetime, type, isDismissed }) => {
        if (isDismissed) {
          closeSnackbar(id);
          return;
        }

        // Do nothing if snackbar is already displayed
        if (displayed.includes(id)) {
          return;
        }

        const action = (snackbarId) => (
          <div className={classes.notificationAction}>
            <button
              className={classes.buttonFirst}
              onClick={() => {
                alert(`I belong to snackbar with id ${snackbarId}`);
              }}
            >
              Undo
            </button>
            <button
              className={classes.buttonSecond}
              onClick={() => {
                closeSnackbar(snackbarId);
              }}
            >
              Dismiss
            </button>
          </div>
        );

        // Display snackbar using notistack
        enqueueSnackbar(text, {
          action,
          key: id,
          autoHideDuration: lifetime,
          icon,
          isClosedBtn,
          SnackbarProps: {
            icon: 'myicon',
            isClosedBtn: 'myIsClosedBtn',
          },
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
