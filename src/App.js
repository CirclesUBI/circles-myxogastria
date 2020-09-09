import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Notifications from '~/components/Notifications';
import Routes from '~/routes';
import SpinnerOverlay from '~/components/SpinnerOverlay';
import UBI from '~/components/UBI';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { checkAppState, initializeApp } from '~/store/app/actions';

const APP_CHECK_FREQUENCY = 1000 * 4;
const APP_CHECK_FREQUENCY_DEVELOPMENT = 1000 * 10;

const useStyles = makeStyles((theme) => ({
  app: {
    overflow: 'hidden',
    minWidth: theme.custom.widthMin,
    maxWidth: theme.custom.widthMax,
    margin: '0 auto',
  },
}));

const App = () => {
  let checkInterval;

  const classes = useStyles();
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  useEffect(() => {
    // Initialize app state in redux store
    const initializeState = async () => {
      try {
        await dispatch(initializeApp());
      } catch (error) {
        logError(error);
      }
    };

    // Check for updates, pending transactions etc. every x seconds
    const updateState = async () => {
      try {
        await dispatch(checkAppState());
      } catch (error) {
        logError(error);

        const errorMessage = formatErrorMessage(error);

        dispatch(
          notify({
            text: `${translate('App.updateErrorMessage')}${errorMessage}`,
            type: NotificationsTypes.ERROR,
          }),
        );
      }
    };

    initializeState();

    const checkFrequency =
      process.env.NODE_ENV === 'production'
        ? APP_CHECK_FREQUENCY
        : APP_CHECK_FREQUENCY_DEVELOPMENT;

    checkInterval = window.setInterval(updateState, checkFrequency);
  }, []);

  // Register an event to disable state checks when leaving application
  window.addEventListener('unload', () => {
    window.clearInterval(checkInterval);
  });

  return (
    <Router>
      <Box className={classes.app}>
        <UBI />
        <Notifications />
        <SpinnerOverlay isVisible={app.isLoading} />
        <Routes />
      </Box>
    </Router>
  );
};

export default App;
