import { Box, Container, Grid, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useRouteMatch } from 'react-router-dom';

import { SEARCH_PATH, SHARE_PATH } from '~/routes';
import { MY_PROFILE_PATH } from '~/routes';

import ActivityIcon from '~/components/ActivityIcon';
import AppNote from '~/components/AppNote';
import AvatarHeader from '~/components/AvatarHeader';
import BackgroundCurved from '~/components/BackgroundCurved';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonDouble from '~/components/ButtonDouble';
import Drawer from '~/components/Drawer';
import Header from '~/components/Header';
import LastInteractions from '~/components/LastInteractions';
import Navigation from '~/components/Navigation';
import NavigationFloating from '~/components/NavigationFloating';
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
}));

const Dashboard = () => {
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
      <BackgroundCurved gradient="turquoise">
        <Header
          className={clsx(classes.header, {
            [classes.headerExpanded]: isMenuExpanded,
          })}
          hasWhiteIcons
          isOrganization={false}
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
            <ButtonDouble
              leftBtnPath={SEARCH_PATH}
              leftBtnText={translate('Dashboard.buttonTrustPeople')}
              rightBtnPath={SHARE_PATH}
              rightBtnText={translate('Dashboard.buttonSendCircles')}
            />
          </Grid>
          <LastInteractions />
          <NavigationFloating color="turquoise" />
        </Container>
      </View>
      <Drawer />
    </Fragment>
  );
};

export default Dashboard;
