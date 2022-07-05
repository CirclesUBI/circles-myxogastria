import { Container, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import { DASHBOARD_PATH, MY_PROFILE_PATH } from '~/routes';

import MyProfile from '~/components/MyProfile';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    top: theme.custom.components.appBarHeight,
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    borderRadius: theme.spacing(2, 2, 0, 0),
  },
}));

const DrawerElement = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const isExpanded = !!useRouteMatch(`(${[MY_PROFILE_PATH].join('|')})`);

  const onClose = () => {
    history.push(DASHBOARD_PATH);
  };

  return (
    <Drawer
      anchor="bottom"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isExpanded}
      onClose={onClose}
    >
      <Container disableGutters maxWidth="sm">
        <Switch location={location}>
          <Route component={MyProfile} path={MY_PROFILE_PATH} />
        </Switch>
      </Container>
    </Drawer>
  );
};

export default React.memo(DrawerElement);
