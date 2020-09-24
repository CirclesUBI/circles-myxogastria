import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import ButtonBack from '~/components/ButtonBack';
import ButtonSend from '~/components/ButtonSend';
import ButtonShare from '~/components/ButtonShare';
import CenteredHeading from '~/components/CenteredHeading';
import Dialog from '~/components/Dialog';
import Header from '~/components/Header';
import NotFound from '~/views/NotFound';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import core from '~/services/core';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import {
  IconShare,
  IconTrust,
  IconTrustActive,
  IconTrustMutual,
} from '~/styles/icons';
import { DASHBOARD_PATH } from '~/routes';
import { ZERO_ADDRESS } from '~/utils/constants';
import { checkTrustState } from '~/store/trust/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { trustUser, untrustUser } from '~/store/trust/actions';
import { usePendingTrust, usePendingTransfer } from '~/hooks/activity';
import { useRelativeSendLink, useProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

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

  const [isDeployed, setIsDeployed] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();

  // Check against these three cases where we can't send Circles
  //
  // a) We look at our own profile
  // b) Our Safe is not deployed yet
  // c) The profiles Safe is not deployed yet
  const isSendDisabled =
    safe.currentAccount === address ||
    safe.pendingNonce !== null ||
    !isDeployed;

  useEffect(() => {
    // Update trust connection info
    dispatch(checkTrustState());

    // Find out if Token is deployed
    const checkTokenDeployment = async () => {
      try {
        const tokenAddress = await core.token.getAddress(address);
        setIsDeployed(tokenAddress !== ZERO_ADDRESS);
        setIsReady(true);
      } catch {
        setIsDeployed(false);
        setIsReady(true);
      }
    };

    checkTokenDeployment();
  }, [dispatch, address]);

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
  const dispatch = useDispatch();
  const history = useHistory();

  const { network } = useSelector((state) => state.trust);
  const safe = useSelector((state) => state.safe);

  const isPending = usePendingTrust(address);
  const isDisabled = safe.currentAccount === address;

  const [isTrustConfirmOpen, setIsTrustConfirmOpen] = useState(false);
  const [isRevokeTrustOpen, setIsRevokeTrustOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const connection = network.find(({ safeAddress }) => {
    return safeAddress === address;
  });

  const isMeTrusting = connection && connection.isIncoming;
  const isTrustingMe = connection && connection.isOutgoing;

  const { username } = useUserdata(address);

  const TrustIcon = isMeTrusting
    ? isTrustingMe
      ? IconTrustMutual
      : IconTrustActive
    : IconTrust;

  const handleTrustOpen = () => {
    setIsTrustConfirmOpen(true);
  };

  const handleTrustClose = () => {
    setIsTrustConfirmOpen(false);
  };

  const handleTrust = async () => {
    dispatch(showSpinnerOverlay());
    setIsTrustConfirmOpen(false);

    try {
      await dispatch(trustUser(address));

      dispatch(
        notify({
          text: translate('Profile.successTrust', {
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      history.push(DASHBOARD_PATH);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('Profile.errorTrust', {
            username,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  const handleRevokeTrustOpen = () => {
    setIsRevokeTrustOpen(true);
  };

  const handleRevokeTrustClose = () => {
    setIsRevokeTrustOpen(false);
  };

  const handleRevokeTrust = async () => {
    dispatch(showSpinnerOverlay());
    setIsRevokeTrustOpen(false);

    try {
      await dispatch(untrustUser(address));

      dispatch(
        notify({
          text: translate('Profile.successRevokeTrust', {
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('Profile.errorRevokeTrust', {
            username,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  if (isSent) {
    return <Redirect push to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <Dialog
        cancelLabel={translate('Profile.dialogTrustCancel')}
        confirmLabel={translate('Profile.dialogTrustConfirm')}
        id="trust"
        open={isTrustConfirmOpen}
        text={translate('Profile.dialogTrustDescription', { username })}
        title={translate('Profile.dialogTrustTitle', { username })}
        onClose={handleTrustClose}
        onConfirm={handleTrust}
      />
      <Dialog
        cancelLabel={translate('Profile.dialogRevokeTrustCancel')}
        confirmLabel={translate('Profile.dialogRevokeTrustConfirm')}
        id="trust"
        open={isRevokeTrustOpen}
        text={translate('Profile.dialogRevokeTrustDescription', { username })}
        title={translate('Profile.dialogRevokeTrustTitle', { username })}
        onClose={handleRevokeTrustClose}
        onConfirm={handleRevokeTrust}
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
