import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';

import { removeNotification } from '~/store/notifications/actions';

let displayed = [];

const Notifications = () => {
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
    messages.forEach(({ id, text, lifetime, type, isDismissed }) => {
      if (isDismissed) {
        closeSnackbar(id);
        return;
      }

      // Do nothing if snackbar is already displayed
      if (displayed.includes(id)) {
        return;
      }

      // Display snackbar using notistack
      enqueueSnackbar(text, {
        key: id,
        autoHideDuration: lifetime,
        variant: type,
        onExited: (event, notificationId) => {
          // Remove this snackbar from redux store
          dispatch(removeNotification(notificationId));
          removeDisplayed(notificationId);
        },
      });

      // Keep track of snackbars that we've displayed
      storeDisplayed(id);
    });
  }, [messages]);

  return null;
};

export default Notifications;
