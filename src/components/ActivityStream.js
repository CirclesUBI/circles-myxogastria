import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActivityStreamItem from '~/components/ActivityStreamItem';
import Button from '~/components/Button';
import { useUpdateLoop } from '~/hooks/update';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import {
  FILTER_TRANSACTION_RECEIVED,
  FILTER_TRANSACTION_SENT,
} from '~/utils/constants';

const { ActivityTypes } = core.activity;

const ActivityStream = ({
  activities,
  filterType,
  isLoading,
  isMoreAvailable,
  lastSeenAt,
  lastUpdatedAt,
  onLoadMore,
}) => {
  const dispatch = useDispatch();

  useUpdateLoop(
    async () => {
      await dispatch(checkFinishedActivities({ isCheckingOnlyPending: false }));
      await dispatch(checkPendingActivities());
    },
    {
      frequency: 1000 * 10,
    },
  );

  return (
    <Fragment>
      {!isLoading && (
        <ActivityStreamList
          activities={activities}
          filterType={filterType}
          lastSeenAt={lastSeenAt}
          lastUpdatedAt={lastUpdatedAt}
        />
      )}
      {isLoading && (
        <Box mx="auto" my={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}
      {!isLoading && isMoreAvailable && onLoadMore && (
        <Box my={2}>
          <Button disabled={isLoading} fullWidth isOutline onClick={onLoadMore}>
            {translate('ActivityStream.buttonLoadMore')}
          </Button>
        </Box>
      )}
    </Fragment>
  );
};

const ActivityStreamList = ({
  activities,
  filterType,
  lastSeenAt,
  lastUpdatedAt,
}) => {
  const { safeAddress, walletAddress } = useSelector((state) => {
    return {
      safeAddress: state.safe.currentAccount,
      walletAddress: state.wallet.address,
    };
  });

  if (lastUpdatedAt === 0) {
    return null;
  }

  if (activities.length === 0) {
    return (
      <Typography align="center">
        {translate('ActivityStream.bodyNothingHereYet')}
      </Typography>
    );
  }

  return (
    <Grid container spacing={2} style={{ paddingBottom: '32px' }}>
      {activities.reduce(
        (
          acc,
          {
            data,
            hash,
            createdAt,
            type,
            isPending,
            txHash,
            transactionHash,
            timestamp,
          },
        ) => {
          // Always filter gas transfers
          if (
            type === ActivityTypes.TRANSFER &&
            data.to === process.env.SAFE_FUNDER_ADDRESS
          ) {
            return acc;
          }

          const info =
            data.from === safeAddress
              ? { prefix: '-', type: 'SENT' }
              : { prefix: '+', type: 'RECEIVED' };

          if (
            (filterType === FILTER_TRANSACTION_RECEIVED &&
              info.type !== 'RECEIVED') ||
            (filterType === FILTER_TRANSACTION_SENT && info.type !== 'SENT')
          ) {
            return acc;
          }

          const isSeen =
            lastSeenAt && createdAt
              ? DateTime.fromISO(lastSeenAt) > DateTime.fromISO(createdAt)
              : true;

          const key = hash || transactionHash;

          const createdAtDate =
            createdAt || DateTime.fromSeconds(timestamp).toISO();

          const txHashUpdated = txHash || transactionHash;

          const item = (
            <Grid item key={key} xs={12}>
              <ActivityStreamItem
                createdAt={createdAtDate}
                data={data}
                isPending={isPending}
                isSeen={isSeen}
                prefix={info.prefix}
                safeAddress={safeAddress}
                txHash={txHashUpdated}
                type={type}
                walletAddress={walletAddress}
              />
            </Grid>
          );

          acc.push(item);

          return acc;
        },
        [],
      )}
    </Grid>
  );
};

ActivityStream.propTypes = {
  activities: PropTypes.array.isRequired,
  filterType: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  isMoreAvailable: PropTypes.bool.isRequired,
  lastSeenAt: PropTypes.string,
  lastUpdatedAt: PropTypes.string,
  onLoadMore: PropTypes.func,
};

ActivityStreamList.propTypes = {
  activities: PropTypes.array.isRequired,
  filterType: PropTypes.string,
  lastSeenAt: PropTypes.string,
  lastUpdatedAt: PropTypes.string,
};

export default ActivityStream;
