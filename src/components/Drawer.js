import React from 'react';
import { Container, SwipeableDrawer } from '@material-ui/core';
import {
  Route,
  Switch,
  generatePath,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import {
  DASHBOARD_PATH,
  ACTIVITIES_PATH,
  MY_PROFILE_PATH,
  SEARCH_PATH,
} from '~/routes';
import ActivityStream from '~/components/ActivityStream';
import MyProfile from '~/components/MyProfile';
import TrustNetwork from '~/components/TrustNetwork';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    top: theme.custom.components.appBarHeight,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    borderRadius: theme.spacing(2, 2, 0, 0),
  },
}));

const Drawer = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const isExpanded = !!useRouteMatch(
    `(${[ACTIVITIES_PATH, MY_PROFILE_PATH, generatePath(SEARCH_PATH)].join(
      '|',
    )})`,
  );

  const onOpen = () => {
    // Do nothing ...
  };

  const onClose = () => {
    history.push(DASHBOARD_PATH);
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      classes={{
        paper: classes.drawerPaper,
      }}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={isExpanded}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Container disableGutters maxWidth="sm">
        <Switch location={location}>
          <Route component={ActivityStream} path={ACTIVITIES_PATH} />
          <Route component={MyProfile} path={MY_PROFILE_PATH} />
          <Route component={TrustNetwork} path={SEARCH_PATH} />
        </Switch>
      </Container>
    </SwipeableDrawer>
  );
};

export default Drawer;
