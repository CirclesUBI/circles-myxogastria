import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useOnlineStatus } from '~/hooks/network';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

const InternetConnection = () => {
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus();
  const { closeSnackbar } = useSnackbar();
  const { messages } = useSelector((state) => state.notifications);

  useEffect(() => {
    const text = translate('App.errorConnection');
    if (isOnline) {
      if (messages) {
        const offlineSnackbarId = messages.filter((item) => item.text === text);
        if (offlineSnackbarId.length >= 1) {
          closeSnackbar(offlineSnackbarId[0]?.id);
        }
      }
    } else {
      dispatch(
        notify({
          action: false,
          text,
          type: NotificationsTypes.ERROR,
          lifetime: 259200, // 3 days
          icon: 'IconOffline',
        }),
      );
    }
  }, [dispatch, closeSnackbar, isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  return <></>;
};

export default InternetConnection;
