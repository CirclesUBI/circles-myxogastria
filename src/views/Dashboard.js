import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import {
  Badge,
  Container,
  CircularProgress,
  Fab,
  IconButton,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import BalanceDisplay from '~/components/BalanceDisplay';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { IconSend, IconMenu, IconNotification } from '~/styles/icons';

const transitionMixin = ({ transitions }) => ({
  transition: transitions.create(['transform'], {
    easing: transitions.easing.sharp,
    duration: transitions.duration.leavingScreen,
  }),
});

const transitionExpandedMixin = ({ transitions, custom }) => ({
  transform: `translate3d(${custom.components.navigationWidth}px, 0, 0)`,
  transition: transitions.create(['transform'], {
    easing: transitions.easing.easeOut,
    duration: transitions.duration.enteringScreen,
  }),
});

const useStyles = makeStyles((theme) => ({
  dashboardProfile: {
    flexGrow: 1,
  },
  fabSend: {
    ...transitionMixin(theme),
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    background: theme.custom.gradients.purple,
  },
  fabSendExpanded: {
    ...transitionExpandedMixin(theme),
  },
  header: {
    ...transitionMixin(theme),
  },
  headerExpanded: {
    ...transitionExpandedMixin(theme),
  },
  navigation: {
    width: theme.custom.components.navigationWidth,
  },
  view: {
    ...transitionMixin(theme),
  },
  viewExpanded: {
    ...transitionExpandedMixin(theme),
    overflow: 'hidden',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const safe = useSelector((state) => state.safe);

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
        <IconButton aria-label="Menu" edge="start" onClick={handleMenuToggle}>
          <IconMenu />
        </IconButton>
        <CenteredHeading>
          <UsernameDisplay address={safe.currentAccount} />
        </CenteredHeading>
        <DashboardActivityIcon />
      </Header>
      <Navigation className={classes.navigation} isExpanded={isMenuExpanded} />
      <View
        className={clsx(classes.view, {
          [classes.viewExpanded]: isMenuExpanded,
        })}
      >
        <Container maxWidth="sm">
          <BalanceDisplay />
        </Container>
      </View>
      <Fab
        aria-label="Send"
        className={clsx(classes.fabSend, {
          [classes.fabSendExpanded]: isMenuExpanded,
        })}
        color="primary"
        component={Link}
        to="/send"
      >
        <IconSend />
      </Fab>
    </Fragment>
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
      aria-label="Activities"
      component={Link}
      edge="end"
      to="/activities"
    >
      <Badge badgeContent={count} color="primary">
        <IconNotification />
      </Badge>
    </IconButton>
  );
};

export default Dashboard;
