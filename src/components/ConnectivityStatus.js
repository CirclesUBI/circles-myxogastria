import React from 'react';
import { useSelector } from 'react-redux';

import Spinner from '~/components/Spinner';

const ConnectivityStatus = () => {
  const app = useSelector(state => state.app);

  if (app.isConnected) {
    return null;
  }

  return <Spinner />;
};

export default ConnectivityStatus;
