import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Avatar from '~/components/Avatar';
import DialogAddMember from '~/components/DialogAddMember';
import DialogTrust from '~/components/DialogTrust';
import { usePendingTransfer } from '~/hooks/activity';
import { useTrustConnection } from '~/hooks/network';
import { useIsOrganization } from '~/hooks/organization';
import { useRelativeSendLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { addSafeOwner } from '~/store/safe/actions';
import { IconFriends, IconSend, IconTrust } from '~/styles/icons';

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
    borderRadius: '50%',
  },
  cardActionIcon: {
    color: theme.custom.colors.disco,
    fontSize: 16,

    '& path': {
      fill: 'inherit',
    },
  },
  mutualFriends: {
    fontSize: 12,
    color: theme.palette.grey['800'],
  },
  mutualFriendsIcon: {
    fontSize: 9,
    color: theme.palette.grey['800'],
  },
}));

const ProfileMini = ({
  address,
  className,
  hasActions = false,
  isSharedWalletCreation,
  ...props
}) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const sendPath = useRelativeSendLink(address);
  const { username } = useUserdata(address);
  const connection = useTrustConnection(address);
  const [isOpen, setIsOpen] = useState(false);

  const [isRedirect, setIsRedirect] = useState(false);

  const mutualFriendsCount = connection.mutualConnections.length;

  const handleSend = (event) => {
    event.stopPropagation();
    setIsRedirect(true);
  };

  const handleTrust = (event) => {
    event.stopPropagation();
    setIsOpen(true);
  };

  const handleAddMember = async () => {
    try {
      dispatch(showSpinnerOverlay());

      // Find device address connected to this safe
      const ownerAddresses = await core.safe.getOwners(address);

      // Add all device addresses to organization safe
      await Promise.all(
        ownerAddresses.map((ownerAddress) => {
          return dispatch(addSafeOwner(ownerAddress));
        }),
      );

      dispatch(
        notify({
          text: translate('OrganizationMembersAdd.successAddedMember', {
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch {
      dispatch(
        notify({
          text: translate('OrganizationMembersAdd.errorAddedMember', {
            username,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    setIsOpen(false);
    dispatch(hideSpinnerOverlay());
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isRedirect) {
    return <Redirect push to={sendPath} />;
  }

  return (
    <Fragment>
      {isSharedWalletCreation ? (
        <DialogAddMember
          address={address}
          handleAddMember={handleAddMember}
          handleClose={handleClose}
          isOpen={isOpen}
          username={username}
        />
      ) : (
        <DialogTrust
          address={address}
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={handleClose}
        />
      )}
      <Card {...props} className={className}>
        <CardHeader
          action={
            hasActions && (
              <ProfileMiniActions
                address={address}
                connection={connection}
                isSharedWalletCreation={isSharedWalletCreation}
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
            connection.isReady && (
              <Tooltip
                arrow
                placement="left"
                title={translate('ProfileMini.bodyMutualFriends', {
                  count: mutualFriendsCount,
                  username,
                })}
              >
                <Typography className={classes.mutualFriends} component="span">
                  <IconFriends className={classes.mutualFriendsIcon} />{' '}
                  {mutualFriendsCount}
                </Typography>
              </Tooltip>
            )
          }
          title={`@${username}`}
        />
      </Card>
    </Fragment>
  );
};

const ProfileMiniActions = ({
  address,
  onTrust,
  onSend,
  connection,
  isSharedWalletCreation,
}) => {
  const classes = useStyles();

  const { isMeTrusting, isPending: isPendingTrust } = connection;
  const isPendingSend = usePendingTransfer(address);

  const { isOrganization, isPending } = useIsOrganization(address);

  const isPendingOrganization = isPending;

  return (
    <Box display="flex">
      {!isMeTrusting &&
        !isPendingTrust &&
        !isOrganization &&
        !isPendingOrganization && (
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
      {!isPendingSend && !isSharedWalletCreation && (
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
  isSharedWalletCreation: PropTypes.bool,
};

ProfileMiniActions.propTypes = {
  address: PropTypes.string.isRequired,
  connection: PropTypes.object.isRequired,
  isSharedWalletCreation: PropTypes.bool,
  onSend: PropTypes.func.isRequired,
  onTrust: PropTypes.func.isRequired,
};

export default ProfileMini;
