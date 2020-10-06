import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';
import qs from 'qs';
import {
  Avatar as MuiAvatar,
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Grid,
  Zoom,
  IconButton,
  Typography,
} from '@material-ui/core';
import { Link, useHistory, generatePath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import ExternalLink from '~/components/ExternalLink';
import Header from '~/components/Header';
import Logo from '~/components/Logo';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import View from '~/components/View';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  IconCloseOutline,
  IconConnections,
  IconTransactions,
} from '~/styles/icons';
import { ACTIVITIES_PATH } from '~/routes';
import { ZERO_ADDRESS, FAQ_URL, ISSUANCE_RATE_MONTH } from '~/utils/constants';
import { formatMessage } from '~/services/activity';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { usePaymentNote } from '~/hooks/transfer';
import { useRelativeProfileLink, useQuery } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.TRANSFERS;

const QUERY_FILTER_MAP = {
  transfers: ActivityFilterTypes.TRANSFERS,
  connections: ActivityFilterTypes.CONNECTIONS,
};

const filterToQuery = (filterName) => {
  return Object.keys(QUERY_FILTER_MAP).find((key) => {
    return QUERY_FILTER_MAP[key] === filterName;
  });
};

const useStyles = makeStyles((theme) => ({
  avatarTransparent: {
    width: theme.custom.components.avatarSize,
    height: theme.custom.components.avatarSize,
    backgroundColor: 'transparent',
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
  cardContentPaymentNote: {
    margin: 0,
    paddingBottom: 0,
    fontSize: '0.8rem',
    wordWrap: 'break-word',
    fontWeight: theme.typography.fontWeightMedium,
  },
  cardContentCloseIcon: {
    color: theme.palette.grey['700'],
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

const ActivityStream = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { category } = useQuery();
  const preselectedCategory =
    category in QUERY_FILTER_MAP
      ? QUERY_FILTER_MAP[category]
      : DEFAULT_CATEGORY;

  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);

  const activity = categories[selectedCategory];
  const isLoading = activity.isLoadingMore || activity.lastUpdated === 0;

  const handleLoadMore = () => {
    dispatch(loadMoreActivities(selectedCategory));
  };

  const handleFilterSelection = (event, newFilter) => {
    const query = qs.stringify({
      category: filterToQuery(newFilter) || filterToQuery(DEFAULT_CATEGORY),
    });

    history.replace(`${generatePath(ACTIVITIES_PATH)}?${query}`);
    setSelectedCategory(newFilter);
  };

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('ActivityStream.headingActivityLog')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <TabNavigation
            value={selectedCategory}
            onChange={handleFilterSelection}
          >
            <TabNavigationAction
              icon={<IconTransactions />}
              label={translate('ActivityStream.bodyFilterTransactions')}
              value={ActivityFilterTypes.TRANSFERS}
            />
            <TabNavigationAction
              icon={<IconConnections />}
              label={translate('ActivityStream.bodyFilterConnections')}
              value={ActivityFilterTypes.CONNECTIONS}
            />
          </TabNavigation>
          <ActivityStreamList activity={activity} lastSeenAt={lastSeenAt} />
          {isLoading && (
            <Box m="auto">
              <CircularProgress />
            </Box>
          )}
          {activity.isMoreAvailable && (
            <Box mt={2}>
              <Button
                disabled={isLoading}
                fullWidth
                isOutline
                onClick={handleLoadMore}
              >
                {translate('ActivityStream.buttonLoadMore')}
              </Button>
            </Box>
          )}
        </Container>
      </View>
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
      {activities.reduce(
        (acc, { data, hash, createdAt, type, isPending, txHash }) => {
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
                txHash={txHash}
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
      <Collapse in={isExpanded}>
        <CardContent className={classes.cardContent}>
          <ActivityStreamExplained
            actor={actor}
            data={data}
            isExpanded={isExpanded}
            messageId={messageId}
            txHash={props.txHash}
            type={props.type}
          />
          <Zoom
            in={isExpanded}
            style={{ transitionDelay: isExpanded ? '250ms' : '0ms' }}
          >
            <Box display="flex" justifyContent="center">
              <IconButton onClick={handleClick}>
                <IconCloseOutline className={classes.cardContentCloseIcon} />
              </IconButton>
            </Box>
          </Zoom>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const ActivityStreamExplained = ({
  actor,
  data,
  messageId,
  type,
  txHash,
  isExpanded,
}) => {
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
      {type === ActivityTypes.HUB_TRANSFER && isExpanded && (
        <ActivityStreamPaymentNote txHash={txHash} />
      )}
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

const ActivityStreamPaymentNote = ({ txHash }) => {
  const classes = useStyles();
  const paymentNote = usePaymentNote(txHash);

  return (
    paymentNote && (
      <Fragment>
        <Divider className={classes.divider} light />
        <Typography
          className={classes.cardContentPaymentNote}
          color="textSecondary"
          component="p"
          variant="body1"
        >
          {translate('ActivityStream.bodyPaymentNote', {
            note: paymentNote,
          })}
        </Typography>
        <Divider className={classes.divider} light />
      </Fragment>
    )
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
  txHash: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

ActivityStreamExplained.propTypes = {
  actor: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  messageId: PropTypes.string.isRequired,
  txHash: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
};

ActivityStreamPaymentNote.propTypes = {
  txHash: PropTypes.string.isRequired,
};

ActivityStreamAvatars.propTypes = {
  addressOrigin: PropTypes.string.isRequired,
  addressTarget: PropTypes.string.isRequired,
};

export default ActivityStream;
