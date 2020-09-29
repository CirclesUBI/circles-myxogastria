import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import ButtonBack from '~/components/ButtonBack';
import ButtonSend from '~/components/ButtonSend';
import ButtonShare from '~/components/ButtonShare';
import CenteredHeading from '~/components/CenteredHeading';
import DialogTrust from '~/components/DialogTrust';
import DialogTrustRevoke from '~/components/DialogTrustRevoke';
import Header from '~/components/Header';
import NotFound from '~/views/NotFound';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import {
  IconShare,
  IconTrust,
  IconTrustActive,
  IconTrustMutual,
} from '~/styles/icons';
import { DASHBOARD_PATH } from '~/routes';
import { usePendingTransfer } from '~/hooks/activity';
import { useRelativeSendLink, useProfileLink } from '~/hooks/url';
import { useTrustConnection, useDeploymentStatus } from '~/hooks/network';

const useStyles = makeStyles((theme) => ({
  trustButton: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
  },
  trustButtonActive: {
    background: theme.custom.gradients.turquoise,
  },
  trustButtonDisabled: {
    background: theme.custom.gradients.gray,
  },
  trustButtonIcon: {
    position: 'relative',
    left: 1,
  },
}));

const Profile = () => {
  const { address } = useParams();

  const shareLink = useProfileLink(address);
  const shareText = translate('Profile.shareText', { shareLink });

  if (!web3.utils.checkAddressChecksum(address)) {
    return <NotFound />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          <UsernameDisplay address={address} />
        </CenteredHeading>
        <ButtonShare edge="end" isIcon text={shareText} url={shareLink}>
          <IconShare />
        </ButtonShare>
      </Header>
      <View>
        <Box align="center" mb={2}>
          <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<ProfileTrustButton address={address} />}
            overlap="circle"
          >
            <Avatar address={address} size="large" />
          </Badge>
        </Box>
      </View>
      <ProfileSendButton address={address} />
    </Fragment>
  );
};

const ProfileSendButton = ({ address }) => {
  const isTransferPending = usePendingTransfer(address);
  const sendPath = useRelativeSendLink(address);
  const safe = useSelector((state) => state.safe);
  const { isReady, isDeployed } = useDeploymentStatus(address);

  // Check against these three cases where we can't send Circles
  //
  // a) We look at our own profile
  // b) Our Safe is not deployed yet
  // c) The profiles Safe is not deployed yet
  const isSendDisabled =
    safe.currentAccount === address ||
    safe.pendingNonce !== null ||
    !isDeployed;

  return !isReady || isTransferPending ? (
    <ButtonSend isPending to={sendPath} />
  ) : isSendDisabled ? (
    <Tooltip
      arrow
      title={
        !isDeployed
          ? translate('Profile.tooltipSafeNotDeployed')
          : translate('Profile.tooltipSafeIsYou')
      }
    >
      <ButtonSend disabled to={sendPath} />
    </Tooltip>
  ) : (
    <ButtonSend to={sendPath} />
  );
};

const ProfileTrustButton = ({ address }) => {
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

  const { isPending, isMeTrusting, isTrustingMe } = useTrustConnection(address);
  const isDisabled = safe.currentAccount === address;

  const [isTrustConfirmOpen, setIsTrustConfirmOpen] = useState(false);
  const [isRevokeTrustOpen, setIsRevokeTrustOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const TrustIcon = isMeTrusting
    ? isTrustingMe
      ? IconTrustMutual
      : IconTrustActive
    : IconTrust;

  const handleTrustOpen = () => {
    setIsTrustConfirmOpen(true);
  };

  const handleTrustSuccess = () => {
    setIsSent(true);
  };

  const handleTrustClose = () => {
    setIsTrustConfirmOpen(false);
  };

  const handleRevokeTrustOpen = () => {
    setIsRevokeTrustOpen(true);
  };

  const handleRevokeTrustSuccess = () => {
    setIsSent(true);
  };

  const handleRevokeTrustClose = () => {
    setIsRevokeTrustOpen(false);
  };

  if (isSent) {
    return <Redirect push to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <DialogTrust
        address={address}
        isOpen={isTrustConfirmOpen}
        onClose={handleTrustClose}
        onConfirm={handleTrustClose}
        onSuccess={handleTrustSuccess}
      />
      <DialogTrustRevoke
        address={address}
        isOpen={isRevokeTrustOpen}
        onClose={handleRevokeTrustClose}
        onConfirm={handleRevokeTrustClose}
        onSuccess={handleRevokeTrustSuccess}
      />
      <IconButton
        classes={{
          root: clsx(classes.trustButton, {
            [classes.trustButtonActive]: isMeTrusting,
          }),
          disabled: classes.trustButtonDisabled,
        }}
        disabled={isDisabled || isPending}
        onClick={isMeTrusting ? handleRevokeTrustOpen : handleTrustOpen}
      >
        {isPending ? (
          <CircularProgress size={24} />
        ) : (
          <TrustIcon className={classes.trustButtonIcon} />
        )}
      </IconButton>
    </Fragment>
  );
};

ProfileSendButton.propTypes = {
  address: PropTypes.string.isRequired,
};

ProfileTrustButton.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Profile;
