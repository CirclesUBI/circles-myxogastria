import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import {
  Avatar as MuiAvatar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import core from '~/services/core';
import translate from '~/services/locale';
import { IconConnections, IconTransactions } from '~/styles/icons';
import { formatMessage } from '~/services/activity';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.TRANSFERS;

const useStyles = makeStyles((theme) => ({
  avatarPending: {
    width: theme.custom.components.avatarSize,
    height: theme.custom.components.avatarSize,
    backgroundColor: 'transparent',
  },
  bottomNavigation: {
    marginBottom: theme.spacing(2),
  },
  bottomNavigationAction: {
    maxWidth: 'none',
  },
  bottomNavigationLabel: {
    marginTop: theme.spacing(1),
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '0.9rem',
    borderBottom: '2px solid transparent',
    '&.Mui-selected': {
      fontSize: '0.9rem',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
}));

const ActivityStream = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);

  const activity = categories[selectedCategory];
  const isLoading = activity.isLoadingMore || activity.lastUpdated === 0;

  const onLoadMore = () => {
    dispatch(loadMoreActivities(selectedCategory));
  };

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <BottomNavigation
        className={classes.bottomNavigation}
        showLabels
        value={selectedCategory}
        onChange={(event, newCategory) => {
          setSelectedCategory(newCategory);
        }}
      >
        <BottomNavigationAction
          classes={{
            root: classes.bottomNavigationAction,
            label: classes.bottomNavigationLabel,
          }}
          icon={<IconTransactions />}
          label={translate('ActivityStream.bodyFilterTransactions')}
          value={ActivityFilterTypes.TRANSFERS}
        />
        <BottomNavigationAction
          classes={{
            root: classes.bottomNavigationAction,
            label: classes.bottomNavigationLabel,
          }}
          icon={<IconConnections />}
          label={translate('ActivityStream.bodyFilterConnections')}
          value={ActivityFilterTypes.CONNECTIONS}
        />
      </BottomNavigation>
      <ActivityStreamList activity={activity} lastSeenAt={lastSeenAt} />
      {isLoading && (
        <Box m="auto">
          <CircularProgress />
        </Box>
      )}
      {activity.isMoreAvailable && (
        <Box mt={2}>
          <Button disabled={isLoading} fullWidth isOutline onClick={onLoadMore}>
            {translate('ActivityStream.buttonLoadMore')}
          </Button>
        </Box>
      )}
    </Fragment>
  );
};

const ActivityStreamList = ({ activity, lastSeenAt }) => {
  const { safeAddress, walletAddress } = useSelector((state) => {
    return {
      safeAddress: state.safe.currentAccount,
      walletAddress: state.wallet.address,
    };
  });

  const { activities, lastUpdated } = activity;

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

  return (
    <Grid container spacing={2}>
      {activities.reduce((acc, { data, hash, createdAt, type, isPending }) => {
        // Always filter gas transfers
        if (
          type === ActivityTypes.TRANSFER &&
          data.to === process.env.SAFE_FUNDER_ADDRESS
        ) {
          return acc;
        }

        const item = (
          <Grid item key={hash} xs={12}>
            <ActivityStreamItem
              createdAt={createdAt}
              data={data}
              isPending={isPending}
              isSeen={createdAt < lastSeenAt}
              safeAddress={safeAddress}
              type={type}
              walletAddress={walletAddress}
            />
          </Grid>
        );

        acc.push(item);

        return acc;
      }, [])}
    </Grid>
  );
};

const ActivityStreamItem = (props) => {
  const classes = useStyles();

  // Reformat the message for the user
  const {
    actorAddress,
    data,
    formattedDate,
    isOwnerAddress,
    messageId,
  } = formatMessage(props);

  const actor = useUserdata(actorAddress).username;
  const profilePath = useRelativeProfileLink(
    actorAddress && !isOwnerAddress ? actorAddress : props.safeAddress,
  );

  const message = useMemo(() => {
    return translate(`ActivityStream.bodyActivity${messageId}`, {
      ...data,
      actor,
    });
  }, [actor, data, messageId]);

  return (
    <Card>
      <CardHeader
        avatar={
          <Link to={profilePath}>
            {props.isPending ? (
              <MuiAvatar className={classes.avatarPending}>
                <CircularProgress size={40} />
              </MuiAvatar>
            ) : actorAddress ? (
              <Avatar address={actorAddress} />
            ) : (
              <Avatar address={props.safeAddress} />
            )}
          </Link>
        }
        subheader={formattedDate}
        title={<Typography>{message}</Typography>}
      />
    </Card>
  );
};

ActivityStreamList.propTypes = {
  activity: PropTypes.object.isRequired,
  lastSeenAt: PropTypes.string.isRequired,
};

ActivityStreamItem.propTypes = {
  createdAt: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  isSeen: PropTypes.bool.isRequired,
  safeAddress: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

export default ActivityStream;
