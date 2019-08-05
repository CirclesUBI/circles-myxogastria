import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from '~/views/Dashboard';

const Routes = () => (
  <Switch>
    <Route path="/" component={Dashboard} />
  </Switch>
);

export default Routes;
