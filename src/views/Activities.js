import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import { updateLastSeen } from '~/store/activity/actions';

const Activities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, []);

  return <ActivityStream />;
};

export default Activities;
