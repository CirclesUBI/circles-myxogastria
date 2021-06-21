import { Container, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, generatePath } from 'react-router-dom';

import {
  DASHBOARD_PATH,
  MY_PROFILE_PATH,
  ORGANIZATION_MEMBERS_PATH,
  QR_GENERATOR_PATH,
  SEND_PATH,
} from '~/routes';

import ActivityStreamWithTabs from '~/components/ActivityStreamWithTabs';
import AppNote from '~/components/AppNote';
import BalanceDisplayOrganization from '~/components/BalanceDisplayOrganization';
import ButtonAction from '~/components/ButtonAction';
import ButtonSend from '~/components/ButtonSend';
import CenteredHeading from '~/components/CenteredHeading';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { IconMembers, IconMenu, IconQRLarge } from '~/styles/icons';

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

const DashboardOrganization = () => {
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const safe = useSelector((state) => state.safe);

  const handleMenuToggle = () => {
    setIsMenuExpanded(!isMenuExpanded);
  };

  const handleMenuClick = () => {
    setIsMenuExpanded(false);
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
          <Link className={classes.profileLink} to={MY_PROFILE_PATH}>
            <UsernameDisplay address={safe.currentAccount} />
          </Link>
        </CenteredHeading>
        <IconButton
          aria-label="Members"
          component={Link}
          edge="end"
          to={ORGANIZATION_MEMBERS_PATH}
        >
          <IconMembers />
        </IconButton>
      </Header>
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
        <Container maxWidth="sm">
          <BalanceDisplayOrganization />
          <AppNote />
          <ActivityStreamWithTabs basePath={DASHBOARD_PATH} />
        </Container>
      </View>
      <ButtonAction
        aria-label="Generate QR"
        className={clsx(classes.fabQR, {
          [classes.fabExpanded]: isMenuExpanded,
        })}
        component={Link}
        to={QR_GENERATOR_PATH}
      >
        <IconQRLarge fontSize="large" />
      </ButtonAction>
      <ButtonSend
        className={clsx(classes.fab, {
          [classes.fabExpanded]: isMenuExpanded,
        })}
        to={generatePath(SEND_PATH)}
      />
      <Drawer />
    </Fragment>
  );
};

export default DashboardOrganization;
