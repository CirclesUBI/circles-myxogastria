import {
  Box,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SEARCH_PATH, SEND_PATH } from '~/routes';

import ActivityIcon from '~/components/ActivityIcon';
import AppNote from '~/components/AppNote';
import AvatarHeader from '~/components/AvatarHeader';
import BackgroundCurved from '~/components/BackgroundCurved';
import BalanceDisplayOrganization from '~/components/BalanceDisplayOrganization';
import Button from '~/components/Button';
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
  dashboardContainer: {
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

const Dashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isMenuExpanded, setIsMenuExpanded] = useState(false);

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
        <Container className={classes.dashboardContainer} maxWidth="sm">
          <Box className={classes.balanceContainer}>
            <BalanceDisplayOrganization />
          </Box>
          <AppNote />
          <Grid item xs={12}>
            <ButtonGroup className={classes.buttonContainer} fullWidth>
              <Button isOutline isPrimary to={SEARCH_PATH}>
                {translate('Dashboard.buttonTrustPeople')}
              </Button>
              <Button isOutline to={SEND_PATH}>
                {translate('Dashboard.buttonSendCircles')}
              </Button>
            </ButtonGroup>
          </Grid>
          <LastInteractions />
          <NavigationFloating gradient="turquoise" />
        </Container>
      </View>
      <Drawer />
    </Fragment>
  );
};

export default Dashboard;
