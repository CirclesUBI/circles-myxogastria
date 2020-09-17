import React, { Fragment, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Badge,
  Box,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Input,
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonSend from '~/components/ButtonSend';
import CenteredHeading from '~/components/CenteredHeading';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import HumbleAlert from '~/components/HumbleAlert';
import LastInteractions from '~/components/LastInteractions';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconMenu, IconNotification, IconSearch } from '~/styles/icons';
import { MY_PROFILE_PATH, SEARCH_PATH } from '~/routes';

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
  profileLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  fabSend: {
    ...transitionMixin(theme),
  },
  fabSendExpanded: {
    ...transitionExpandedMixin(theme),
  },
  fabSendIcon: {
    position: 'relative',
    top: 1,
    left: -1,
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
  searchInput: {
    padding: theme.spacing(1, 2),
    borderRadius: 10,
    backgroundColor: theme.palette.grey['100'],
    color: theme.palette.grey['800'],
  },
}));

const Dashboard = () => {
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
        <DashboardActivityIcon />
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
          <BalanceDisplay />
          {process.env.STAGING_NOTIFICATION && (
            <Box my={2}>
              <HumbleAlert>
                {translate('default.bodyStagingNotification')}
              </HumbleAlert>
            </Box>
          )}
          <Box my={2}>
            <DashboardSearch />
          </Box>
          <LastInteractions />
        </Container>
      </View>
      <ButtonSend
        className={clsx(classes.fabSend, {
          [classes.fabSendExpanded]: isMenuExpanded,
        })}
        to="/send"
      />
      <Drawer />
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
        {isPending ? <CircularProgress size={25} /> : <IconNotification />}
      </Badge>
    </IconButton>
  );
};

const DashboardSearch = () => {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef();

  const handleSearchSelect = () => {
    ref.current.blur();
    history.push(SEARCH_PATH);
  };

  return (
    <Input
      className={classes.searchInput}
      disableUnderline={true}
      endAdornment={
        <InputAdornment position="end">
          <IconSearch fontSize="small" />
        </InputAdornment>
      }
      fullWidth
      id="search"
      placeholder={translate('Dashboard.formSearch')}
      readOnly
      ref={ref}
      onClick={handleSearchSelect}
    />
  );
};

export default Dashboard;
