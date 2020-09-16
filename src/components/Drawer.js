import React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import {
  Route,
  Switch,
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
import Search from '~/views/Search';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    top: theme.custom.components.appBarHeight,
    borderRadius: '20px 20px 0 0',
  },
}));

const Drawer = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const isExpanded = !!useRouteMatch(
    `(${[ACTIVITIES_PATH, MY_PROFILE_PATH, SEARCH_PATH].join('|')})`,
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
      open={isExpanded}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Switch location={location}>
        <Route component={ActivityStream} path={ACTIVITIES_PATH} />
        <Route component={null} path={MY_PROFILE_PATH} />
        <Route component={Search} path={SEARCH_PATH} />
      </Switch>
    </SwipeableDrawer>
  );
};

export default Drawer;
