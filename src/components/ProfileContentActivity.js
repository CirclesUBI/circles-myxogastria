import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import { loadMoreActivitiesMutual } from '~/store/activity/actions';
import ActionTypes from '~/store/activity/types';

const useStyles = makeStyles(() => {
  return {
    activityContainer: {
      paddingBottom: '110px',
    },
  };
});

const ProfileContentActivity = ({ address }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const mutualActivities = useSelector(
    (state) => state.activity.mutualActivities.activities,
  );
  const isMoreAvailable = useSelector(
    (state) => state.activity.mutualActivities.isMoreAvailable,
  );
  const isLoadingMore = useSelector(
    (state) => state.activity.mutualActivities.isLoadingMore,
  );
  const mutualAddress = useSelector(
    (state) => state.activity.mutualActivities.mutualAddress,
  );

  useEffect(() => {
    if (mutualAddress !== address) {
      dispatch({
        type: ActionTypes.ACTIVITIES_MUTUAL_RESET,
      });

      Promise.all([
        dispatch({
          type: ActionTypes.ACTIVITIES_MUTUAL_ADDRESS_UPDATE,
          meta: {
            mutualAddress: address,
          },
        }),
        dispatch(loadMoreActivitiesMutual(address, { fromOffsetZero: true })),
      ]);
    }
  }, [address, mutualAddress]); //eslint-disable-line react-hooks/exhaustive-deps

  const currentTime = DateTime.now().toISO();

  const handleLoadMore = () => {
    dispatch(loadMoreActivitiesMutual(address));
  };

  return (
    <Box className={classes.activityContainer}>
      <ActivityStream
        activities={mutualActivities}
        isLoading={isLoadingMore}
        isMoreAvailable={isMoreAvailable}
        lastSeenAt={currentTime}
        onLoadMore={handleLoadMore}
      />
    </Box>
  );
};

ProfileContentActivity.propTypes = {
  address: PropTypes.string,
};

export default ProfileContentActivity;
