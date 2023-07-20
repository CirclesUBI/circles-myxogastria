import { Box, CircularProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import { loadMoreAllActivities } from '~/store/activity/actions';

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
  const { categories } = useSelector((state) => state.activity);
  const categorySymbols = Object.getOwnPropertySymbols(categories);
  const isMoreAvailable = categorySymbols.some(
    (symbol) => categories[symbol].isMoreAvailable,
  );

  useUpdateLoop(
    async () => {
      await dispatch(checkFinishedActivities({ isCheckingOnlyPending: false }));
      await dispatch(checkPendingActivities());
    },
    {
      frequency: 1000 * 10,
    },
  );

  function filterActivities(categories, address) {
    const filteredActivities = [];
    const lastUpdatedAt = [];
    let offset;
    const normalizedAddress = address.toLowerCase();
    const categorySymbols = Object.getOwnPropertySymbols(categories);

    for (const symbol of categorySymbols) {
      const category = categories[symbol];
      lastUpdatedAt.push(category.lastUpdatedAt);
      offset = category.offset;

      for (const activity of category.activities) {
        if (
          activity.data?.user?.toLowerCase() === normalizedAddress ||
          activity.data?.from?.toLowerCase() === normalizedAddress ||
          activity.data?.to?.toLowerCase() === normalizedAddress
        ) {
          filteredActivities.push(activity);
        }
      }
    }

    filteredActivities.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return [filteredActivities, lastUpdatedAt, offset];
  }

  const [filteredActivities, setFilteredActivities] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState([]);

  useEffect(() => {
    const [activities, updatedAt] = filterActivities(categories, address);
    setFilteredActivities(activities);
    setLastUpdatedAt(updatedAt);
  }, [categories, address, dispatch]);

  const currentTime = DateTime.now().toISO();

  const handleLoadMore = () => {
    dispatch(loadMoreAllActivities());
  };

  if (lastUpdatedAt.every((value) => value === 0)) {
    return null;
  }

  if (filteredActivities?.length === 0) {
    return (
      <Typography align="center">
        {translate('ActivityStream.bodyNothingHereYet')}
      </Typography>
    );
  }

  return (
    <>
      <Box className={classes.activityContainer}>
        <ActivityStream
          activities={filteredActivities}
          isLoading={false}
          isMoreAvailable={isMoreAvailable}
          lastSeenAt={currentTime}
          onLoadMore={handleLoadMore}
        />
      </Box>
    </>
  );
};

ProfileContentActivity.propTypes = {
  address: PropTypes.string,
};

export default ProfileContentActivity;
