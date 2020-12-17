import React, { Fragment, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Input,
  Typography,
} from '@material-ui/core';
import { Link, useHistory, generatePath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import AppNote from '~/components/AppNote';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonSend from '~/components/ButtonSend';
import ButtonShare from '~/components/ButtonShare';
import CenteredHeading from '~/components/CenteredHeading';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import LastInteractions from '~/components/LastInteractions';
import Navigation from '~/components/Navigation';
import UsernameDisplay from '~/components/UsernameDisplay';
import HumbleAlert from '~/components/HumbleAlert';
import Footer from '~/components/Footer';
import ValidationStatus from '~/components/ValidationStatus';
import View from '~/components/View';
import translate from '~/services/locale';
import { CATEGORIES } from '~/store/activity/reducers';
import { IconMenu, IconNotification, IconSearch } from '~/styles/icons';
import { useProfileLink } from '~/hooks/url';
import {
  MY_PROFILE_PATH,
  SEND_PATH,
  SEARCH_PATH,
  VALIDATION_SHARE_PATH,
} from '~/routes';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import { useUpdateLoop } from '~/hooks/update';

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

const Verified = ({ classes }) => {
  return (
    <>
      <View className={classes.view}>
        <Container maxWidth="sm">
          <BalanceDisplay />
          <AppNote />
          <Box my={2}>
            <DashboardSearch />
          </Box>
          <LastInteractions />
        </Container>
      </View>
      <ButtonSend className={classes.fabSend} to={generatePath(SEND_PATH)} />
      <Drawer />
    </>
  );
};

const Authorized = ({ trust, safe, token }) => {
  const isDeploymentReady =
    safe.pendingIsFunded || token.isFunded || trust.isTrusted;

  const shareLink = useProfileLink(safe.pendingAddress);
  const shareText = translate('Profile.shareText', { shareLink });

  return (
    <>
      <View>
        <Container maxWidth="sm">
          <Box mb={6} mt={2}>
            <BalanceDisplay />
          </Box>
          <Typography align="center" variant="h2">
            {translate('Validation.headingBuildYourWebOfTrust')}
          </Typography>
          <ValidationStatus />
        </Container>
      </View>
      <Footer>
        <HumbleAlert>{translate('Validation.bodyDoNotReset')}</HumbleAlert>
        {!isDeploymentReady && (
          <Box mt={2}>
            <Button fullWidth isPrimary to={VALIDATION_SHARE_PATH}>
              {translate('Validation.buttonShareProfileLink')}
            </Button>
          </Box>
        )}
      </Footer>
    </>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const { trust, app, safe, token } = useSelector((state) => state);

  const verified = app.isValidated && app.isAuthorized;
  const authorized = !app.isValidated && app.isAuthorized;

  useUpdateLoop(async () => {
    await dispatch(checkFinishedActivities());
    await dispatch(checkPendingActivities());
  });

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Fragment>
      <Header className={classes.header}>
        <IconButton aria-label="Menu" edge="start" onClick={handleMenuToggle}>
          <IconMenu />
        </IconButton>
        <CenteredHeading>
          <Link className={classes.profileLink} to={MY_PROFILE_PATH}>
            <UsernameDisplay
              address={safe.currentAccount || safe.pendingAddress}
            />
          </Link>
        </CenteredHeading>
        <DashboardActivityIcon />
      </Header>

      {authorized ? (
        <Authorized
          app={app}
          classes={classes}
          safe={safe}
          token={token}
          trust={trust}
        />
      ) : (
        verified && (
          <Verified app={app} classes={classes} safe={safe} token={token} />
        )
      )}
      <Navigation
        authorized
        open={isOpen}
        verified={verified}
        onClose={handleMenuToggle}
        onOpen={handleMenuToggle}
      />
    </Fragment>
  );
};

const DashboardActivityIcon = () => {
  const classes = useStyles();
  const { categories, lastSeenAt } = useSelector((state) => {
    return state.activity;
  });

  // Is there any pending transactions?
  const isPending = CATEGORIES.find((category) => {
    return !!categories[category].activities.find((activity) => {
      return activity.isPending;
    });
  });

  // Count how many activities we haven't seen yet
  const count = CATEGORIES.reduce((acc, category) => {
    return (
      acc +
      categories[category].activities.reduce((itemAcc, activity) => {
        return activity.createdAt > lastSeenAt ? itemAcc + 1 : itemAcc;
      }, 0)
    );
  }, 0);

  return (
    <IconButton
      aria-label="Activities"
      component={Link}
      edge="end"
      to="/activities"
    >
      {isPending ? (
        <CircularProgress size={28} />
      ) : count > 0 ? (
        <Avatar className={classes.notificationCount}>
          {count > 99 ? '99+' : count}
        </Avatar>
      ) : (
        <IconNotification style={{ fontSize: 28 }} />
      )}
    </IconButton>
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
