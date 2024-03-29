import makeStyles from '@mui/styles/makeStyles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
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

      '&.notistack-MuiContent-success': {
        background: theme.custom.colors.blue100,
        boxShadow: theme.custom.shadows.greyBottomRight,
      },
      '&.notistack-MuiContent-error': {
        background: theme.custom.colors.purple50,
        boxShadow: theme.custom.shadows.lightGray,
      },
      '&.notistack-MuiContent-warning': {
        background: theme.custom.colors.white,
        border: `2px solid ${theme.custom.colors.pink300}`,
        borderRadius: '8px',
        boxShadow: theme.custom.shadows.lightGray,
        color: theme.custom.colors.pink100,
        textAlign: 'center',
        '& div': {
          paddingLeft: '0px',
        },
      },
      '&.notistack-MuiContent-info': {
        background: theme.custom.gradients.pinkToPurple,
        boxShadow: theme.custom.shadows.lightGray,
      },
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
    <SnackbarProvider className={classes.snackbarProvider} hideIconVariant>
      {/* Needed for MUI Date components */}
      <LocalizationProvider dateAdapter={AdapterLuxon}>
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
      </LocalizationProvider>
    </SnackbarProvider>
  );
};

export default App;
