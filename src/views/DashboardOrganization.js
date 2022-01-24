import { Box, Container, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';

import { DASHBOARD_PATH } from '~/routes';

import ActivityIcon from '~/components/ActivityIcon';
import ActivityStreamWithTabs from '~/components/ActivityStreamWithTabs';
import AppNote from '~/components/AppNote';
import AvatarHeader from '~/components/AvatarHeader';
import BackgroundCurved from '~/components/BackgroundCurved';
import BalanceDisplayOrganization from '~/components/BalanceDisplayOrganization';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import Navigation from '~/components/Navigation';
import NavigationFloating from '~/components/NavigationFloating';
import View from '~/components/View';
import { IconMenu } from '~/styles/icons';

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
  profileLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  fab: {
    ...transitionMixin(theme),
  },
  fabQR: {
    bottom: theme.spacing(12.5),
  },
  fabExpanded: {
    ...transitionExpandedMixin(theme),
  },
  header: {
    ...transitionMixin(theme),
    background: 'transparent',
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
  dashboardOrganizationContainer: {
    marginTop: '95px',
  },
  balanceContainer: {
    margin: '0 auto',
    textAlign: 'center',
  },
  userDataContainer: {
    position: 'relative',
    top: '45px',
  },
}));

const DashboardOrganization = () => {
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleMenuClick = () => {
    setIsMenuExpanded(false);
  };

  return (
    <Fragment>
      <BackgroundCurved gradient="orange">
        <Header
          className={clsx(classes.header, {
            [classes.headerExpanded]: isMenuExpanded,
          })}
        >
          <IconButton aria-label="Menu" edge="start" onClick={handleMenuToggle}>
            <IconMenu />
          </IconButton>
          <AvatarHeader />
          <ActivityIcon />
        </Header>
      </BackgroundCurved>
      <Navigation
        className={classes.navigation}
        isExpanded={isMenuExpanded}
        onClick={handleMenuClick}
      />
      <View
        className={clsx(classes.view, {
          [classes.viewExpanded]: isMenuExpanded,
        })}
      >
        <Container
          className={classes.dashboardOrganizationContainer}
          maxWidth="sm"
        >
          <Box className={classes.balanceContainer}>
            <BalanceDisplayOrganization />
          </Box>
          <AppNote />
          <ActivityStreamWithTabs basePath={DASHBOARD_PATH} />
          <NavigationFloating />
        </Container>
      </View>
      <Drawer />
    </Fragment>
  );
};

export default DashboardOrganization;
