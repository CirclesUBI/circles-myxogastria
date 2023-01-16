import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles((theme) => ({
  // @NOTE: Hacky use of !important, see related issue:
  // https://github.com/iamhosseindhv/notistack/issues/305
  snackbarProvider: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  snackbarInfo: {
    background: `${theme.custom.gradients.pinkToPurple} !important`,
    boxShadow: `${theme.custom.shadows.lightGray} !important`,
    color: `${theme.custom.colors.whiteAlmost} !important`,
  },
  snackbarWarning: {
    background: `${theme.custom.colors.whiteAlmost} !important`,
    border: `2px solid ${theme.custom.colors.deepBlush} !important`,
    borderRadius: '8px !important',
    boxShadow: `${theme.custom.shadows.lightGray} !important`,
    color: `${theme.palette.warning.contrastText} !important`,
    textAlign: 'center !important',
    '& span': {
      background: theme.custom.gradients.lightPinkToPurple,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
  },
  snackbarSuccess: {
    background: `${theme.custom.colors.fountainBlueLighter} !important`,
    boxShadow: `${theme.custom.shadows.grayBottomRight} !important`,
    color: `${theme.custom.colors.whiteAlmost} !important`,
  },
  snackbarError: {
    background: `${theme.custom.colors.lividBrown} !important`,
    boxShadow: `${theme.custom.shadows.lightGray} !important`,
    color: `${theme.custom.colors.whiteAlmost} !important`,
  },
}));

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
