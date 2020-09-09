import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import {
  Badge,
  CircularProgress,
  Fab,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import BalanceDisplay from '~/components/BalanceDisplay';
import Header from '~/components/Header';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { IconMenu, IconNotification } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  dashboardProfile: {
    flexGrow: 1,
  },
  sendFab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  header: {
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  headerExpanded: {
    transform: `translate3d(${theme.custom.navigationWidth}, 0, 0)`,
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  navigation: {
    width: theme.custom.navigationWidth,
  },
  view: {
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  viewExpanded: {
    transform: `translate3d(${theme.custom.navigationWidth}, 0, 0)`,
    transition: theme.transitions.create(['transform'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  return (
    <Fragment>
      <Header
        className={clsx(classes.header, {
          [classes.headerExpanded]: isMenuExpanded,
        })}
      >
        <IconButton aria-label="menu" edge="start" onClick={handleMenuToggle}>
          <IconMenu />
        </IconButton>

        <DashboardProfile />
        <DashboardActivityIcon />
      </Header>

      <Navigation className={classes.navigation} isExpanded={isMenuExpanded} />

      <View
        className={clsx(classes.view, {
          [classes.viewExpanded]: isMenuExpanded,
        })}
      >
        <BalanceDisplay />
      </View>

      <Fab
        aria-label="edit"
        className={classes.sendFab}
        color="secondary"
        component={Link}
        to="/send"
      >
        Send
      </Fab>
    </Fragment>
  );
};

const DashboardProfile = () => {
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

  return (
    <Typography
      align="center"
      className={classes.dashboardProfile}
      noWrap
      variant="h6"
    >
      <UsernameDisplay address={safe.currentAccount} />
    </Typography>
  );
};

const DashboardActivityIcon = () => {
  const { activities, lastSeen } = useSelector((state) => {
    return state.activity;
  });

  // Is there any pending transactions?
  const isPending =
    activities.findIndex((activity) => {
      return activity.isPending;
    }) > -1;

  if (isPending) {
    return <CircularProgress />;
  }

  // Count how many activities we haven't seen yet
  const count = activities.reduce((acc, activity) => {
    if (activity.timestamp > lastSeen) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return (
    <IconButton
      aria-label="menu"
      component={Link}
      edge="start"
      to="/activities"
    >
      <Badge badgeContent={count} color="primary">
        <IconNotification />
      </Badge>
    </IconButton>
  );
};

export default Dashboard;
