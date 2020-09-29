import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import {
  Avatar as MuiAvatar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import Logo from '~/components/Logo';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  IconCloseOutline,
  IconConnections,
  IconTransactions,
} from '~/styles/icons';
import { ZERO_ADDRESS, FAQ_URL, ISSUANCE_RATE_MONTH } from '~/utils/constants';
import { formatMessage } from '~/services/activity';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.TRANSFERS;

const useStyles = makeStyles((theme) => ({
  avatarTransparent: {
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
  cardHeader: {
    cursor: 'pointer',
  },
  cardHeaderContent: {
    fontWeight: theme.typography.fontWeight,
  },
  cardHeaderSubheader: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '0.8rem',
  },
  cardHeaderAction: {
    marginTop: 0,
    marginRight: theme.spacing(0.25),
    alignSelf: 'center',
    fontSize: '2rem',
    fontWeight: theme.typography.fontWeightLight,
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: `${theme.spacing(1.5)}px !important`,
  },
  cardContentText: {
    fontSize: '0.8rem',
    paddingBottom: theme.spacing(1),
  },
  cardContentCloseIcon: {
    color: theme.palette.grey['700'],
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
  const [isExpanded, setIsExanded] = useState(false);

  const handleClick = () => {
    setIsExanded(!isExpanded);
  };

  // Reformat the message for the user
  const {
    addressActor,
    addressOrigin,
    addressTarget,
    data,
    formattedDate,
    messageId,
  } = formatMessage(props);

  const actor = useUserdata(addressActor).username;
  const profilePath = useRelativeProfileLink(
    addressActor ? addressActor : props.safeAddress,
  );

  const isUBIPayout =
    props.type === ActivityTypes.TRANSFER && props.data.from === ZERO_ADDRESS;

  const value = useMemo(() => {
    if (!data.value) {
      return;
    }
    const prefix = data.from === props.safeAddress ? '-' : '+';
    return `${prefix}${data.value}`;
  }, [data, props.safeAddress]);

  const message = useMemo(() => {
    return translate(`ActivityStream.bodyActivity${messageId}`, {
      ...data,
      actor,
    });
  }, [actor, data, messageId]);

  return (
    <Card>
      <CardHeader
        action={value}
        avatar={
          <Link to={profilePath}>
            {props.isPending ? (
              <MuiAvatar className={classes.avatarTransparent}>
                <CircularProgress size={40} />
              </MuiAvatar>
            ) : isUBIPayout ? (
              <MuiAvatar className={classes.avatarTransparent}>
                <Logo size="tiny" />
              </MuiAvatar>
            ) : (
              <Box className={classes.avatarTransparent}>
                <ActivityStreamAvatars
                  addressOrigin={addressOrigin}
                  addressTarget={addressTarget}
                />
              </Box>
            )}
          </Link>
        }
        classes={{
          root: classes.cardHeader,
          action: classes.cardHeaderAction,
          content: classes.cardHeaderContent,
          subheader: classes.cardHeaderSubheader,
        }}
        subheader={formattedDate}
        title={message}
        onClick={handleClick}
      />
      {isExpanded && (
        <CardContent className={classes.cardContent}>
          <ActivityStreamExplained
            actor={actor}
            data={data}
            messageId={messageId}
          />
          <Box display="flex" justifyContent="center">
            <IconButton onClick={handleClick}>
              <IconCloseOutline className={classes.cardContentCloseIcon} />
            </IconButton>
          </Box>
        </CardContent>
      )}
    </Card>
  );
};

const ActivityStreamExplained = ({ actor, data, messageId }) => {
  const classes = useStyles();

  const text = useMemo(() => {
    return translate(`ActivityStream.bodyExplain${messageId}`, {
      ...data,
      actor,
      rate: ISSUANCE_RATE_MONTH,
    });
  }, [actor, data, messageId]);

  return (
    <Fragment>
      <Typography
        className={classes.cardContentText}
        color="textSecondary"
        component="p"
        variant="body1"
      >
        {text}
      </Typography>
      <Typography
        className={classes.cardContentText}
        color="textSecondary"
        component="p"
        variant="body1"
      >
        {translate('ActivityStream.bodyExplainSecondary')}{' '}
        <ExternalLink href={FAQ_URL}>
          {translate('ActivityStream.linkLearnMore')}
        </ExternalLink>
      </Typography>
    </Fragment>
  );
};

const ActivityStreamAvatars = ({ addressOrigin, addressTarget }) => {
  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<Avatar address={addressTarget} size="tiny" />}
      overlap="circle"
    >
      <Avatar address={addressOrigin} size="tiny" />
    </Badge>
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

ActivityStreamExplained.propTypes = {
  actor: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  messageId: PropTypes.string.isRequired,
};

ActivityStreamAvatars.propTypes = {
  addressOrigin: PropTypes.string.isRequired,
  addressTarget: PropTypes.string.isRequired,
};

export default ActivityStream;
