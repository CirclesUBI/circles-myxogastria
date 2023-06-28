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
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
import {
  FAQ_URL,
  FILTER_TRANSACTION_RECEIVED,
  FILTER_TRANSACTION_SENT,
  ISSUANCE_RATE_MONTH,
  ZERO_ADDRESS,
} from '~/utils/constants';

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
  cardHeaderAction: {
    marginTop: 0,
    marginRight: theme.spacing(0.25),
    alignSelf: 'center',
  },
  cardContent: {
    paddingTop: 0,
    ' &.MuiCardContent-root': {
      paddingBottom: `${theme.spacing(1.5)}`,
    },
  },
  cardContentText: {
    paddingBottom: theme.spacing(1),
  },
  cardContentPaymentNote: {
    margin: 0,
    paddingBottom: 0,
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
      <ActivityStreamList
        activities={activities}
        filterType={filterType}
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

          const info =
            data.from === safeAddress
              ? { prefix: '-', type: 'SENT' }
              : { prefix: '+', type: 'RECEIVED' };

          if (
            filterType === FILTER_TRANSACTION_RECEIVED &&
            info.type !== 'RECEIVED'
          ) {
            return acc;
          }

          if (filterType === FILTER_TRANSACTION_SENT && info.type !== 'SENT') {
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
                prefix={info.prefix}
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

    return (
      <Typography
        classes={{ root: props.prefix === '+' ? 'h1_blue' : 'h1_violet' }}
        component="span"
        variant="h1"
      >
        {props.prefix}
        {data.value}
      </Typography>
    );
  }, [data, props.prefix]);

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
        subheader={
          <Typography classes={{ root: 'body6_monochrome' }} variant="body6">
            {formattedDate}
          </Typography>
        }
        title={<Typography variant="h5">{message}</Typography>}
        onClick={handleClick}
      />
      <Collapse in={isExpanded}>
        <CardContent classes={{ root: classes.cardContent }}>
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
              <IconButton size="large" onClick={handleClick}>
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
        component="p"
        variant="body4"
      >
        {text}
      </Typography>
      <Typography
        className={classes.cardContentText}
        component="p"
        variant="body4"
      >
        {translate('ActivityStream.bodyExplainSecondary')}{' '}
        <ExternalLink classes="body5_link" href={FAQ_URL} variant="body5">
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

ActivityStreamItem.propTypes = {
  createdAt: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  isSeen: PropTypes.bool.isRequired,
  prefix: PropTypes.string,
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
