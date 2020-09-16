import PropTypes from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  ONBOARDING_FINALIZATION,
  loadMoreActivities,
  updateLastSeen,
} from '~/store/activity/actions';
import { ZERO_ADDRESS } from '~/utils/constants';
import { formatCirclesValue } from '~/utils/format';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

const { ActivityTypes } = core.activity;

// Parse the activity item and extract the most
// interesting bits from it ..
function formatMessage(props) {
  let actorAddress;
  let isOwnerAddress = false;
  let messageId;

  if (props.type === ActivityTypes.ADD_CONNECTION) {
    if (props.data.canSendTo === props.safeAddress) {
      // I've created a trust connection
      messageId = 'MeTrustedSomeone';
      actorAddress = props.data.user;
    } else {
      // Someone created a trust connection with you
      messageId = 'TrustedBySomeone';
      actorAddress = props.data.canSendTo;
    }
  } else if (props.type === ActivityTypes.REMOVE_CONNECTION) {
    if (props.data.canSendTo === props.safeAddress) {
      // I've removed a trust connection
      messageId = 'MeUntrustedSomeone';
      actorAddress = props.data.user;
    } else {
      // Someone removed a trust connection with you
      messageId = 'UntrustedBySomeone';
      actorAddress = props.data.canSendTo;
    }
  } else if (props.type === ActivityTypes.TRANSFER) {
    if (props.data.from === ZERO_ADDRESS) {
      // I've received Circles from the Hub (UBI)
      messageId = 'ReceivedUBI';
    } else if (props.data.to === process.env.SAFE_FUNDER_ADDRESS) {
      // I've paid Gas fees for a transaction
      // @TODO: Right now not covered by the core
      messageId = 'PaidGasCosts';
    }
  } else if (props.type === ActivityTypes.HUB_TRANSFER) {
    if (props.data.to === props.safeAddress) {
      // I've received Circles from someone
      messageId = 'ReceivedCircles';
      actorAddress = props.data.from;
    } else {
      // I've sent Circles to someone
      messageId = 'SentCircles';
      actorAddress = props.data.to;
    }
  } else if (props.type === ActivityTypes.ADD_OWNER) {
    if (props.data.ownerAddress === props.walletAddress) {
      // I've got added to a Safe (usually during Safe creation)
      messageId = 'MyselfAddedToSafe';
    } else {
      // I've added someone to my Safe
      messageId = 'AddedToSafe';
      isOwnerAddress = true;
      actorAddress = props.data.ownerAddress;
    }
  } else if (props.type === ActivityTypes.REMOVE_OWNER) {
    // I've removed someone from my Safe
    messageId = 'RemovedFromSafe';
    isOwnerAddress = true;
    actorAddress = props.data.ownerAddress;
  } else if (props.type === ONBOARDING_FINALIZATION) {
    // I've just finished onboarding
    messageId = 'SafeAndTokenDeployed';
  }

  // Format the given timestamp to a readable string
  const date = DateTime.fromMillis(props.timestamp).toFormat('dd/LL/yy HH:mm');

  // Check if find a value in the data (during transfers)
  const data = Object.assign({}, props.data);

  if ('value' in data) {
    // Convert the value according to its denominator
    const valueInCircles = formatCirclesValue(data.value, 4);
    data.denominator = 'Circles';
    data.value = valueInCircles;
  }

  if (!messageId) {
    throw new Error('Unknown activity type');
  }

  return {
    actorAddress,
    data,
    date,
    isOwnerAddress,
    messageId,
  };
}

const ActivityStream = () => {
  const activity = useSelector((state) => state.activity);
  const dispatch = useDispatch();
  const isLoading = activity.isLoadingMore || activity.lastUpdated === 0;

  const onLoadMore = () => {
    dispatch(loadMoreActivities());
  };

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, []);

  return (
    <Grid container spacing={2}>
      <ActivityStreamList />
      {isLoading && (
        <Grid item xs={12}>
          <Box m="auto">
            <CircularProgress />
          </Box>
        </Grid>
      )}
      {activity.isMoreAvailable && (
        <Grid item xs={12}>
          <Button disabled={isLoading} fullWidth isOutline onClick={onLoadMore}>
            {translate('ActivityStream.buttonLoadMore')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

const ActivityStreamList = () => {
  const {
    activities,
    lastUpdated,
    lastSeen,
    safeAddress,
    walletAddress,
  } = useSelector((state) => {
    return {
      activities: state.activity.activities,
      lastSeen: state.activity.lastSeen,
      lastUpdated: state.activity.lastUpdated,
      safeAddress: state.safe.currentAccount,
      walletAddress: state.wallet.address,
    };
  });

  if (lastUpdated === 0) {
    return null;
  }

  if (activities.length === 0) {
    return (
      <Typography align="center">
        {translate('ActivityStream.bodyNothingHereYet')}
      </Typography>
    );
  }

  return activities.reduce(
    (acc, { data, hash, timestamp, type, isPending = false }) => {
      // Filter Gas transfers
      if (
        type === ActivityTypes.TRANSFER &&
        data.to === process.env.SAFE_FUNDER_ADDRESS
      ) {
        return acc;
      }

      const item = (
        <Grid item key={hash} xs={12}>
          <ActivityStreamItem
            data={data}
            isPending={isPending}
            isSeen={timestamp < lastSeen}
            safeAddress={safeAddress}
            timestamp={timestamp}
            type={type}
            walletAddress={walletAddress}
          />
        </Grid>
      );

      acc.push(item);

      return acc;
    },
    [],
  );
};

const ActivityStreamItem = (props) => {
  // Reformat the message for the user
  const { date, data, messageId, actorAddress, isOwnerAddress } = formatMessage(
    props,
  );

  const actor = actorAddress
    ? isOwnerAddress
      ? actorAddress.slice(0, 10)
      : useUserdata(actorAddress).username
    : '';

  const profilePath =
    actorAddress && !isOwnerAddress && useRelativeProfileLink(actorAddress);

  const message = useMemo(() => {
    return translate(`ActivityStream.bodyActivity${messageId}`, {
      ...data,
      actor,
    });
  }, [actor]);

  return (
    <Card>
      <CardHeader
        avatar={
          props.isPending ? (
            <CircularProgress fontSize="small" />
          ) : (
            actorAddress && (
              <Link to={profilePath}>
                <Avatar address={actorAddress} />
              </Link>
            )
          )
        }
        subheader={date}
        title={<Typography>{message}</Typography>}
      />
    </Card>
  );
};

ActivityStreamItem.propTypes = {
  data: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  isSeen: PropTypes.bool.isRequired,
  safeAddress: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  type: PropTypes.symbol.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

export default ActivityStream;
