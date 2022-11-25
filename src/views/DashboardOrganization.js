import {
  Box,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { MY_PROFILE_PATH, SEARCH_PATH, SEND_PATH } from '~/routes';

import ActivityIcon from '~/components/ActivityIcon';
import AppNote from '~/components/AppNote';
import AvatarHeader from '~/components/AvatarHeader';
import BackgroundCurved from '~/components/BackgroundCurved';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import LastInteractions from '~/components/LastInteractions';
import Navigation from '~/components/Navigation';
import NavigationFloating from '~/components/NavigationFloating';
import SafeVersion from '~/components/SafeVersion';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
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
  balanceContainer: {
    margin: '0 auto',
    textAlign: 'center',
  },
  userDataContainer: {
    position: 'relative',
    top: '45px',
  },
  buttonContainer: {
    marginTop: '30px',
    marginBottom: '70px',
    padding: '0 15px',
    '& a:first-of-type': {
      border: 0,
    },
    '& a:nth-of-type(2)': {
      borderLeftStyle: 'none',
    },
  },
}));

const DashboardOrganization = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);
  const [useDataFromCache, setIsUseDataFromCache] = useState(true);
  const location = useLocation();
  const isAvatarWithClickEffect = !!useRouteMatch(
    `(${[MY_PROFILE_PATH].join('|')})`,
  );

  useEffect(() => {
    if (location.state?.useCache === false) {
      setIsUseDataFromCache(false);
      // Clear location state as we will use cache next time if possible
      window.history.replaceState({}, document.title);
    }
  }, [location?.state]);

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
      <SafeVersion />
      <BackgroundCurved gradient="violet">
        <Header
          className={classes.header}
          hasWhiteIcons
          isOrganization={true}
          useSpecialWithColorOnScroll={true}
        >
          <IconButton aria-label="Menu" edge="start" onClick={handleMenuToggle}>
            <IconMenu />
          </IconButton>
          <ActivityIcon />
        </Header>
        <AvatarHeader
          hidePlusIcon
          useCache={useDataFromCache}
          withClickEffect={isAvatarWithClickEffect}
          withHoverEffect
        />
      </BackgroundCurved>
      <Navigation
        className={classes.navigation}
        isExpanded={isMenuExpanded}
        onClick={handleMenuClick}
      />
      <View className={classes.view}>
        <Container maxWidth="sm">
          <Box className={classes.balanceContainer}>
            <BalanceDisplay />
          </Box>
          <AppNote messageVersion="dashboard" />
          <Grid item xs={12}>
            <ButtonGroup className={classes.buttonContainer} fullWidth>
              <Button isOutline isPrimary to={SEARCH_PATH}>
                {translate('DashboardOrganization.buttonTrustPeople')}
              </Button>
              <Button isOutline to={SEND_PATH}>
                {translate('DashboardOrganization.buttonSendCircles')}
              </Button>
            </ButtonGroup>
          </Grid>
          <LastInteractions />
          <NavigationFloating color="violet" isAddMembersLink />
        </Container>
      </View>
      <Drawer />
    </Fragment>
  );
};

export default DashboardOrganization;
