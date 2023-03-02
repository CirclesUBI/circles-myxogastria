import makeStyles from '@mui/styles/makeStyles';
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '~/routes';

import InternetConnection from '~/components/InternetConnection';
import Notifications from '~/components/Notifications';
import PinkShadow from '~/components/PinkShadow';
import SafeVersion from '~/components/SafeVersion';
import SpinnerOverlay from '~/components/SpinnerOverlay';
import UBI from '~/components/UBI';
import { initializeApp } from '~/store/app/actions';
import logError from '~/utils/debug';

const useStyles = makeStyles((theme) => {
  // @NOTE: Hacky use of !important, see related issue:
  // https://github.com/iamhosseindhv/notistack/issues/305
  const notificationColumnFix = {
    '& div': {
      paddingLeft: '0px',
    },
    '& > div:first-child': {
      width: 'calc(100% - 45px)',
    },
  };
  return {
    snackbarProvider: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'nowrap',
      position: 'relative',
      bottom: '10px',
      [theme.breakpoints.up('sm')]: {
        bottom: '25px',
      },
    },
    snackbarInfo: {
      background: `${theme.custom.gradients.pinkToPurple} !important`,
      boxShadow: `${theme.custom.shadows.lightGray} !important`,
      color: `${theme.custom.colors.whiteAlmost} !important`,
      ...notificationColumnFix,
    },
    // Warning is used for type special notification
    snackbarWarning: {
      display: 'flex',
      flexDirection: 'row',
      background: `${theme.custom.colors.whiteAlmost} !important`,
      border: `2px solid ${theme.custom.colors.deepBlush} !important`,
      borderRadius: '8px !important',
      boxShadow: `${theme.custom.shadows.lightGray} !important`,
      color: `${theme.custom.colors.purple} !important`,
      textAlign: 'center !important',
      '& span': {
        background: theme.custom.gradients.lightPinkToPurple,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '& div': {
        paddingLeft: '0px',
        background: theme.custom.gradients.lightPinkToPurple,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
      '& > div:first-child': {
        width: 'calc(100% - 45px)',
      },
    },
    snackbarSuccess: {
      background: `${theme.custom.colors.fountainBlueLighter} !important`,
      boxShadow: `${theme.custom.shadows.grayBottomRight} !important`,
      color: `${theme.custom.colors.whiteAlmost} !important`,
      ...notificationColumnFix,
    },
    snackbarError: {
      display: 'flex',
      flexDirection: 'row',
      background: `${theme.custom.colors.lividBrown} !important`,
      boxShadow: `${theme.custom.shadows.lightGray} !important`,
      color: `${theme.custom.colors.whiteAlmost} !important`,
      ...notificationColumnFix,
    },
  };
});

const App = () => {
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

    initializeState();
  }, [dispatch]);

  return (
    <SnackbarProvider
      className={classes.snackbarProvider}
      classes={{
        variantSuccess: classes.snackbarSuccess,
        variantError: classes.snackbarError,
        variantWarning: classes.snackbarWarning,
        variantInfo: classes.snackbarInfo,
      }}
      hideIconVariant
    >
      <Router>
        <PinkShadow>
          <UBI />
          <SafeVersion />
          <Notifications />
          <SpinnerOverlay isVisible={app.isLoading} />
          <Routes />
          <InternetConnection />
        </PinkShadow>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
