import {
  Badge,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Avatar as MuiAvatar,
  Typography,
  Zoom,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Fragment, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import Logo from '~/components/Logo';
import { usePaymentNote } from '~/hooks/transfer';
import { useUpdateLoop } from '~/hooks/update';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import { formatMessage } from '~/services/activity';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import { IconCloseOutline } from '~/styles/icons';
import { FAQ_URL, ISSUANCE_RATE_MONTH, ZERO_ADDRESS } from '~/utils/constants';

const { ActivityTypes } = core.activity;

const useStyles = makeStyles((theme) => ({
  avatarTransparent: {
    width: theme.custom.components.avatarSize,
    height: theme.custom.components.avatarSize,
    backgroundColor: 'transparent',
  },
  cardHeader: {
    cursor: 'pointer',
  },
  cardHeaderUnseen: {
    position: 'relative',
    '&::after': {
      position: 'absolute',
      top: theme.spacing(1.5),
      right: theme.spacing(1.5),
      display: 'block',
      content: '""',
      borderRadius: '50%',
      width: 7,
      height: 7,
      background: theme.custom.gradients.purple,
    },
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

const ActivityStream = ({
  activities,
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
      <ActivityStreamList
        activities={activities}
        lastSeenAt={lastSeenAt}
        lastUpdatedAt={lastUpdatedAt}
      />
      {isLoading && (
        <Box mx="auto" my={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}
      {isMoreAvailable && onLoadMore && (
        <Box my={2}>
          <Button disabled={isLoading} fullWidth isOutline onClick={onLoadMore}>
            {translate('ActivityStream.buttonLoadMore')}
          </Button>
        </Box>
      )}
    </Fragment>
  );
};

const ActivityStreamList = ({ activities, lastSeenAt, lastUpdatedAt }) => {
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

          const isSeen =
            DateTime.fromISO(lastSeenAt) > DateTime.fromISO(createdAt);

          const item = (
            <Grid item key={hash} xs={12}>
              <ActivityStreamItem
                createdAt={createdAt}
                data={data}
                isPending={isPending}
                isSeen={isSeen}
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
          root: clsx(classes.cardHeader, {
            [classes.cardHeaderUnseen]: !props.isSeen,
          }),
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
      overlap="circular"
    >
      <Avatar address={addressOrigin} size="tiny" />
    </Badge>
  );
};

ActivityStream.propTypes = {
  activities: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMoreAvailable: PropTypes.bool.isRequired,
  lastSeenAt: PropTypes.string,
  lastUpdatedAt: PropTypes.string,
  onLoadMore: PropTypes.func,
};

ActivityStreamList.propTypes = {
  activities: PropTypes.array.isRequired,
  lastSeenAt: PropTypes.string,
  lastUpdatedAt: PropTypes.string,
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
