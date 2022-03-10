import {
  Box,
  Container,
  IconButton,
  Input,
  InputAdornment,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, generatePath, useHistory } from 'react-router-dom';

import { MY_PROFILE_PATH, SEARCH_PATH, SEND_PATH } from '~/routes';

import ActivityIcon from '~/components/ActivityIcon';
import AppNote from '~/components/AppNote';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonSend from '~/components/ButtonSend';
import CenteredHeading from '~/components/CenteredHeading';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import LastInteractions from '~/components/LastInteractions';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import { IconMenu, IconSearch } from '~/styles/icons';

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
  notificationCount: {
    width: '28px',
    height: '28px',
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontSize: 12,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const safe = useSelector((state) => state.safe);

  useUpdateLoop(async () => {
    await dispatch(checkFinishedActivities());
    await dispatch(checkPendingActivities());
  });

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
        <ActivityIcon />
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
          <AppNote />
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
        to={generatePath(SEND_PATH)}
      />
      <Drawer />
    </Fragment>
  );
};

const DashboardSearch = () => {
  const classes = useStyles();
  const history = useHistory();
  const ref = useRef();

  const handleSearchSelect = () => {
    ref.current.blur();
    history.push(generatePath(SEARCH_PATH));
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
