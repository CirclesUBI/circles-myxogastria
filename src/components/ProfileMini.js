import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '~/components/Avatar';
import DialogTrust from '~/components/DialogTrust';
import translate from '~/services/locale';
import { IconFriends, IconSend, IconTrust } from '~/styles/icons';
import { usePendingTransfer } from '~/hooks/activity';
import { useRelativeSendLink } from '~/hooks/url';
import { useTrustConnection, useDeploymentStatus } from '~/hooks/network';
import { useUserdata } from '~/hooks/username';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1),
  },
  cardHeaderAction: {
    marginTop: 0,
    marginRight: theme.spacing(0.25),
    alignSelf: 'center',
  },
  cardActionButton: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.grey['300']}`,
    borderRadius: 7,
  },
  cardActionIcon: {
    color: theme.palette.primary.main,
    fontSize: 16,
  },
  mututalFriends: {
    fontSize: 12,
    color: theme.palette.grey['800'],
  },
  mutualFriendsIcon: {
    fontSize: 9,
    color: theme.palette.grey['800'],
  },
}));

const ProfileMini = ({ address, className, hasActions = false, ...props }) => {
  const classes = useStyles();

  const sendPath = useRelativeSendLink(address);
  const { username } = useUserdata(address);
  const connection = useTrustConnection(address);
  const { isReady, isDeployed } = useDeploymentStatus(address);

  const [isRedirect, setIsRedirect] = useState(false);
  const [isTrustOpen, setIsTrustOpen] = useState(false);

  const mutualFriendsCount = connection.mutualConnections.length;

  const handleSend = (event) => {
    event.stopPropagation();
    setIsRedirect(true);
  };

  const handleTrust = (event) => {
    event.stopPropagation();
    setIsTrustOpen(true);
  };

  const handleTrustClose = () => {
    setIsTrustOpen(false);
  };

  if (isRedirect) {
    return <Redirect push to={sendPath} />;
  }

  return (
    <Fragment>
      <DialogTrust
        address={address}
        isOpen={isTrustOpen}
        onClose={handleTrustClose}
        onConfirm={handleTrustClose}
      />
      <Card {...props} className={className}>
        <CardHeader
          action={
            hasActions && (
              <ProfileMiniActions
                address={address}
                connection={connection}
                onSend={handleSend}
                onTrust={handleTrust}
              />
            )
          }
          avatar={<Avatar address={address} />}
          classes={{
            root: classes.cardHeader,
            action: classes.cardHeaderAction,
          }}
          subheader={
            isReady &&
            connection.isReady && (
              <Fragment>
                {isDeployed ? (
                  <Tooltip
                    arrow
                    placement="left"
                    title={translate('ProfileMini.bodyMutualFriends', {
                      count: mutualFriendsCount,
                      username,
                    })}
                  >
                    <Typography
                      className={classes.mututalFriends}
                      component="span"
                    >
                      <IconFriends className={classes.mutualFriendsIcon} />{' '}
                      {mutualFriendsCount}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography
                    className={classes.mututalFriends}
                    component="span"
                  >
                    {translate('ProfileMini.bodyUndeployedToken')}
                  </Typography>
                )}
              </Fragment>
            )
          }
          title={`@${username}`}
        />
      </Card>
    </Fragment>
  );
};

const ProfileMiniActions = ({ address, onTrust, onSend, connection }) => {
  const classes = useStyles();

  const { isMeTrusting, isPending: isPendingTrust } = connection;
  const isPendingSend = usePendingTransfer(address);

  return (
    <Box display="flex">
      {!isMeTrusting && !isPendingTrust && (
        <Fragment>
          <IconButton
            aria-label="Trust"
            className={classes.cardActionButton}
            onClick={onTrust}
          >
            <IconTrust className={classes.cardActionIcon} />
          </IconButton>
        </Fragment>
      )}
      {!isPendingSend && (
        <IconButton
          aria-label="Send"
          className={classes.cardActionButton}
          onClick={onSend}
        >
          <IconSend className={classes.cardActionIcon} />
        </IconButton>
      )}
    </Box>
  );
};

ProfileMini.propTypes = {
  address: PropTypes.string.isRequired,
  className: PropTypes.string,
  hasActions: PropTypes.bool,
};

ProfileMiniActions.propTypes = {
  address: PropTypes.string.isRequired,
  connection: PropTypes.object.isRequired,
  onSend: PropTypes.func.isRequired,
  onTrust: PropTypes.func.isRequired,
};

export default ProfileMini;
