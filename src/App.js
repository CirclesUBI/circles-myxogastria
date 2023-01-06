import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '~/routes';

import Notifications from '~/components/Notifications';
import PinkShadow from '~/components/PinkShadow';
import SafeVersion from '~/components/SafeVersion';
import SpinnerOverlay from '~/components/SpinnerOverlay';
import UBI from '~/components/UBI';
import { initializeApp } from '~/store/app/actions';
import { NotificationsTypes } from '~/store/notifications/actions';
import {
  IconAlert,
  IconBrowser,
  IconCrossInCircle,
  IconOffline,
  IconOkTick,
  IconPartySuccess,
  IconRefresh,
  IconTriangleWarning,
} from '~/styles/icons';
import logError from '~/utils/debug';

const useStyles = makeStyles((theme) => ({
  snackbar: {},
  // @NOTE: Hacky use of !important, see related issue:
  // https://github.com/iamhosseindhv/notistack/issues/305
  snackbarInfo: {
    background: `${theme.custom.gradients.info} !important`,
    color: `${theme.palette.info.contrastText} !important`,
  },
  snackbarWarning: {
    background: `${theme.custom.gradients.warning} !important`,
    color: `${theme.palette.warning.contrastText} !important`,
  },
  snackbarError: {
    background: `${theme.custom.gradients.error} !important`,
    color: `${theme.palette.error.contrastText} !important`,
  },
  snackbarSuccess: {
    background: `${theme.custom.colors.fountainBlueLighter} !important`,
    color: `${theme.custom.colors.whiteAlmost} !important`,
  },
  snackbarIconVariant: {
    marginRight: theme.spacing(1),
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const notistackRef = useRef();

  const onClickDismiss = (notificationId) => () => {
    notistackRef.current.closeSnackbar(notificationId);
  };

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

  // const ReportCompleteSnackbar = (props) => {
  //   console.log('props', props);
  //   return <p>hahaha</p>;
  // };

  return (
    <SnackbarProvider
      // Components={{
      //   reportComplete: ReportCompleteSnackbar,
      // }}
      // action={(notificationId) => {
      //   return (
      //     // eslint-disable-next-line react/display-name
      //     <IconButton color="inherit" onClick={onClickDismiss(notificationId)}>
      //       <IconCrossInCircle fontSize="small" />
      //     </IconButton>
      //   );
      // }}
      classes={{
        variantSuccess: classes.snackbarSuccess,
        // variantSuccessBrowser: classes.snackbarSuccess,
        variantError: classes.snackbarError,
        // variantErrorRefresh: classes.snackbarError,
        // variantErrorOffline: classes.snackbarError,
        variantWarning: classes.snackbarWarning,
        variantInfo: classes.snackbarInfo,
      }}
      hideIconVariant
      // iconVariant={
      //   {
      //     info: <IconAlert className={classes.snackbarIconVariant} />,
      //     default: <IconAlert className={classes.snackbarIconVariant} />,
      //     error: <IconTriangleWarning className={classes.snackbarIconVariant} />,
      //     errorRefresh: <IconRefresh className={classes.snackbarIconVariant} />,
      //     errorOffline: <IconOffline className={classes.snackbarIconVariant} />,
      //     success: <IconOkTick className={classes.snackbarIconVariant} />,
      //     successBrowser: <IconBrowser className={classes.snackbarIconVariant} />,
      //     warning: <IconAlert className={classes.snackbarIconVariant} />,
      //   }
      // }
      ref={notistackRef}
    >
      <Router>
        <PinkShadow>
          <UBI />
          <SafeVersion />
          <Notifications />
          <SpinnerOverlay isVisible={app.isLoading} />
          <Routes />
        </PinkShadow>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
