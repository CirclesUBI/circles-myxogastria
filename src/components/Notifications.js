import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  NotificationsTypes,
  removeNotification,
} from '~/store/notifications/actions';
import {
  IconCrossInCircle,
  IconOkTick,
  IconPartySuccess,
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
  iconButtonClose: {
    borderRadius: '8px',
    '&:hover': {
      background: theme.custom.colors.lightWhite,
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.3rem',
    },
  },
  isSpecial: {
    '& .MuiSvgIcon-root': {
      '& path': {
        fill: theme.custom.colors.violet,
      },
    },
    '&:hover': {
      background: theme.custom.colors.whiteAlmost,
      '& .MuiSvgIcon-root': {
        '& path': {
          fill: theme.custom.colors.oldLavender,
        },
      },
    },
  },
}));

const CloseButton = ({ notificationId, onClickHandler, type }) => {
  const classes = useStyles();

  return (
    <IconButton
      className={clsx(classes.iconButtonClose, {
        [classes.isSpecial]: type === NotificationsTypes.WARNING,
      })}
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
    function chooseIcon(icon, type) {
      if (icon) {
        return iconSelector(icon);
      } else {
        switch (type) {
          case NotificationsTypes.SUCCESS:
          case NotificationsTypes.INFO:
            return <IconOkTick />;
          case NotificationsTypes.ERROR:
            return <IconTriangleWarning />;
          case NotificationsTypes.WARNING:
            return <IconPartySuccess />;
        }
      }
    }
    messages.forEach(
      ({ id, text, icon, action, lifetime, type, isDismissed }) => {
        if (isDismissed) {
          closeSnackbar(id);
          return;
        }

        const actionElement =
          action === false ? (
            action
          ) : (
            <CloseButton
              notificationId={id}
              type={type}
              onClickHandler={() => closeSnackbar(id)}
            />
          );

        // Do nothing if snackbar is already displayed
        if (displayed.includes(id)) {
          return;
        }

        const IconElement = chooseIcon(icon, type);

        const notificationText = (
          <Box className={classes.iconTextContainer}>
            <Box className={classes.iconContainer}>{IconElement}</Box>
            {text}
          </Box>
        );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, enqueueSnackbar, closeSnackbar, messages]);

  return null;
};

CloseButton.propTypes = {
  notificationId: PropTypes.number.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  type: PropTypes.string,
};

export default Notifications;
