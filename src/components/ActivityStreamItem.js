import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  IconButton,
  Typography,
  Zoom,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Fragment, useMemo, useState } from 'react';

import ActivityStreamItemAvatar from '~/components/ActivityStreamItemAvatar';
import ExternalLink from '~/components/ExternalLink';
import { usePaymentNote } from '~/hooks/transfer';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import { formatMessage } from '~/services/activity';
import core from '~/services/core';
import translate from '~/services/locale';
import { IconCloseOutline } from '~/styles/icons';
import { FAQ_URL, ISSUANCE_RATE_MONTH, ZERO_ADDRESS } from '~/utils/constants';

const { ActivityTypes } = core.activity;

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    boxShadow: theme.custom.shadows.navigationFloating,
    '&:hover': {
      background: theme.custom.colors.blue600,

      '& .MuiCardHeader-root': {
        background: theme.custom.colors.blue600,
      },
    },
  },
  cardHeader: {
    cursor: 'pointer',
    background: theme.custom.colors.white,
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
      width: '13px',
      height: '13px',
      background: theme.custom.gradients.pinkToPurple,
    },
  },
  cardHeaderAction: {
    marginTop: 0,
    marginRight: theme.spacing(0.25),
    alignSelf: 'center',
  },
  cardContent: {
    padding: '15px 0 15px',
    margin: '5px 15px 0 15px',
    borderTop: `1px solid ${theme.custom.colors.purple200}`,
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

const ActivityStreamItem = (props) => {
  const classes = useStyles();
  const [isExpanded, setIsExanded] = useState(false);

  const handleClick = () => {
    setIsExanded(!isExpanded);
  };

  // Reformat the message for the user
  let {
    addressActor,
    addressOrigin,
    addressTarget,
    data,
    formattedDate,
    messageId,
  } = props.type !== 'NEWS' ? formatMessage(props) : props;

  if (!formattedDate) {
    formattedDate = DateTime.fromISO(
      props.data.createdAt || props.data.date,
    ).toFormat('dd.LL.yyyy');
  }

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
    return messageId
      ? translate(`ActivityStream.bodyActivity${messageId}`, {
          ...data,
          actor,
        })
      : data.title?.en;
  }, [actor, data, messageId]);

  return (
    <Card classes={{ root: classes.cardContainer }}>
      <CardHeader
        action={value}
        avatar={
          <ActivityStreamItemAvatar
            addressOrigin={addressOrigin}
            addressTarget={addressTarget}
            iconId={data.iconId}
            isUBIPayout={isUBIPayout}
            profilePath={profilePath}
            type={props.type}
          />
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
            extendedMsg={data.message?.en}
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
  extendedMsg,
}) => {
  const classes = useStyles();

  const text = useMemo(() => {
    return translate(`ActivityStream.bodyExplain${messageId}`, {
      ...data,
      actor,
      rate: ISSUANCE_RATE_MONTH / 30,
    });
  }, [actor, data, messageId]);

  return (
    <Fragment>
      {type === ActivityTypes.HUB_TRANSFER && isExpanded && (
        <ActivityStreamPaymentNote txHash={txHash} />
      )}
      {messageId && (
        <Typography
          className={classes.cardContentText}
          component="p"
          variant="body4"
        >
          {text}
        </Typography>
      )}
      <Typography
        className={classes.cardContentText}
        component={extendedMsg ? 'div' : 'p'}
        variant={extendedMsg ? 'wysiwyg' : 'body4'}
      >
        {!extendedMsg && translate('ActivityStream.bodyExplainSecondary')}
        {extendedMsg && (
          <span
            dangerouslySetInnerHTML={{
              __html:
                extendedMsg || translate('ActivityStream.bodyExplainSecondary'),
            }}
            style={{ display: 'inline' }}
          ></span>
        )}{' '}
        {!extendedMsg && (
          <ExternalLink href={FAQ_URL} variant="body5">
            {translate('ActivityStream.linkLearnMore')}
          </ExternalLink>
        )}
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

ActivityStreamItem.propTypes = {
  createdAt: PropTypes.string,
  data: PropTypes.object.isRequired,
  isPending: PropTypes.bool,
  isSeen: PropTypes.bool.isRequired,
  prefix: PropTypes.string.isRequired,
  safeAddress: PropTypes.string.isRequired,
  txHash: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.symbol.isRequired,
    PropTypes.string.isRequired,
  ]),
  walletAddress: PropTypes.string.isRequired,
};

ActivityStreamExplained.propTypes = {
  actor: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  extendedMsg: PropTypes.string,
  isExpanded: PropTypes.bool.isRequired,
  messageId: PropTypes.string,
  txHash: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
};

ActivityStreamPaymentNote.propTypes = {
  txHash: PropTypes.string.isRequired,
};

export default ActivityStreamItem;
