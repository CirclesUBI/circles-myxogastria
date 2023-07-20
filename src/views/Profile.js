import {
  Badge,
  Box,
  Container,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, generatePath, useParams } from 'react-router-dom';

import { DASHBOARD_PATH, PROFILE_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import BadgeTab from '~/components/BadgeTab';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonSend from '~/components/ButtonSend';
import ButtonShare from '~/components/ButtonShare';
import ButtonTrust from '~/components/ButtonTrust';
import CenteredHeading from '~/components/CenteredHeading';
import DialogTrust from '~/components/DialogTrust';
import DialogTrustRevoke from '~/components/DialogTrustRevoke';
import Header from '~/components/Header';
import ProfileContentActivity from '~/components/ProfileContentActivity';
import ProfileMini from '~/components/ProfileMini';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { usePendingTransfer } from '~/hooks/activity';
import { useDeploymentStatus, useTrustConnection } from '~/hooks/network';
import { useUpdateLoop } from '~/hooks/update';
import { useProfileLink, useRelativeSendLink } from '~/hooks/url';
import { useIsOrganization, useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import {
  checkFinishedActivities,
  checkPendingActivities,
} from '~/store/activity/actions';
import { checkTrustState } from '~/store/trust/actions';
import { IconActivity, IconShare, IconTrustMutual } from '~/styles/icons';
import NotFound from '~/views/NotFound';

const PANEL_ACTIVITY = Symbol('panelActivity');
const PANEL_TRUST = Symbol('panelTrust');

const DEFAULT_PANEL = PANEL_TRUST;

const PAGE_SIZE = 10;

const useStyles = makeStyles((theme) => ({
  mutualUserCard: {
    cursor: 'pointer',
  },
  iconActive: {
    '& path': {
      fill: theme.custom.colors.violet,
    },
  },
}));

const Profile = () => {
  const dispatch = useDispatch();
  const { address } = useParams();

  useUpdateLoop(async () => {
    await dispatch(checkFinishedActivities({ isCheckingOnlyPending: true }));
    await dispatch(checkPendingActivities());
    await dispatch(checkTrustState());
  });

  const safe = useSelector((state) => state.safe);
  const shareLink = useProfileLink(address);
  const shareText = translate('Profile.shareText', { shareLink });

  const trustStatus = useTrustConnection(address);
  const deploymentStatus = useDeploymentStatus(address);

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
        <Container maxWidth="sm">
          <Box align="center" mb={2}>
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <ProfileTrustButton
                  address={address}
                  trustStatus={trustStatus}
                />
              }
              overlap="circular"
            >
              <Avatar address={address} size="large" />
            </Badge>
            {address !== safe.currentAccount && (
              <ProfileStatus
                address={address}
                deploymentStatus={deploymentStatus}
                trustStatus={trustStatus}
              />
            )}
          </Box>
          {address !== safe.currentAccount && (
            <ProfileContent
              address={address}
              deploymentStatus={deploymentStatus}
              trustStatus={trustStatus}
            />
          )}
        </Container>
      </View>
      <ProfileSendButton
        address={address}
        deploymentStatus={deploymentStatus}
      />
    </Fragment>
  );
};

const ProfileStatus = ({ address, deploymentStatus, trustStatus }) => {
  const { isOrganization, isReady } = useIsOrganization(address);
  const { username } = useUserdata(address);

  let messageId = 'CommonFriends';

  if (!deploymentStatus.isReady) {
    return null;
  }

  if (deploymentStatus.isDeployed) {
    if (trustStatus.isTrustingMe && !trustStatus.isMeTrusting) {
      messageId = 'TrustingMe';
    } else if (trustStatus.isMeTrusting && trustStatus.isTrustingMe) {
      messageId = 'MutualTrust';
    } else if (trustStatus.isMeTrusting) {
      messageId = 'MeTrusting';
    }
  } else if (isOrganization) {
    if (trustStatus.isTrustingMe) {
      messageId = 'TrustingMe';
    } else {
      messageId = null;
    }
  } else {
    messageId = 'NotDeployedYet';
  }

  if (!isReady || !messageId) {
    return null;
  }

  return (
    <Box mt={2} mx={4}>
      <Typography align="center">
        {messageId === 'CommonFriends'
          ? translate('Profile.bodyStatusCommonFriends', {
              count: trustStatus.mutualConnections.length,
              username,
            })
          : translate('Profile.bodyStatus' + messageId, { username })}
      </Typography>
    </Box>
  );
};

const ProfileContent = ({ address, deploymentStatus, trustStatus }) => {
  const [selectedPanel, setSelectedPanel] = useState(DEFAULT_PANEL);
  const [redirectPath, setRedirectPath] = useState(null);

  const handleProfileSelection = (selectedAddress) => {
    setRedirectPath(
      generatePath(PROFILE_PATH, {
        address: selectedAddress,
      }),
    );
  };

  const handlePanelSelection = (newPanel) => {
    setSelectedPanel(newPanel);
  };

  // Directly reset redirect path when it was set to prevent infinite loop
  useEffect(() => {
    if (redirectPath) {
      setRedirectPath(null);
    }
  }, [redirectPath]);

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  if (!deploymentStatus.isReady || !deploymentStatus.isDeployed) {
    return null;
  }

  const mutualyTrusted = trustStatus.mutualConnections.length;

  return (
    <Fragment>
      <TabNavigation
        value={selectedPanel}
        onChange={(event, newPanel) => {
          handlePanelSelection(newPanel);
        }}
      >
        <TabNavigationAction
          icon={<IconActivity />}
          label={translate('Profile.bodyActivity')}
          value={PANEL_ACTIVITY}
        />
        <TabNavigationAction
          icon={
            <BadgeTab
              badgeContent={mutualyTrusted}
              icon={IconTrustMutual}
              isActive={selectedPanel === PANEL_TRUST}
            />
          }
          label={translate('Profile.bodyMutuallyTrusted')}
          value={PANEL_TRUST}
        />
      </TabNavigation>
      {selectedPanel === PANEL_ACTIVITY ? (
        <ProfileContentActivity address={address} />
      ) : (
        <ProfileContentTrustedBy
          trustStatus={trustStatus}
          onSelect={handleProfileSelection}
        />
      )}
    </Fragment>
  );
};

const ProfileContentTrustedBy = ({ trustStatus, onSelect }) => {
  const classes = useStyles();
  const [limit, setLimit] = useState(PAGE_SIZE);

  const handleLoadMore = () => {
    setLimit(limit + PAGE_SIZE);
  };

  if (trustStatus.mutualConnections.length === 0) {
    return (
      <Typography align="center">
        {translate('Profile.bodyNoMutualFriends')}
      </Typography>
    );
  }

  return (
    <Fragment>
      <Grid container spacing={2}>
        {trustStatus.mutualConnections.slice(0, limit).map((safeAddress) => {
          return (
            <Grid item key={safeAddress} xs={12}>
              <ProfileMini
                address={safeAddress}
                className={classes.mutualUserCard}
                hasActions
                onClick={() => {
                  onSelect(safeAddress);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      {trustStatus.mutualConnections.length > limit && (
        <Box mt={2}>
          <Button fullWidth isOutline onClick={handleLoadMore}>
            {translate('Finder.buttonLoadMore')}
          </Button>
        </Box>
      )}
    </Fragment>
  );
};

const ProfileSendButton = ({ address, deploymentStatus }) => {
  const isTransferPending = usePendingTransfer(address);
  const sendPath = useRelativeSendLink(address);
  const safe = useSelector((state) => state.safe);
  const { isOrganization, isReady } = useIsOrganization(address);

  // Check against these three cases where we can't send Circles
  //
  // a) We look at our own profile - don't show any button
  // b) Our Safe is not deployed yet - show disabled button
  // c) The profiles Safe is not deployed yet - show disabled button
  if (safe.currentAccount === address) {
    return null;
  }

  const isSendDisabled =
    safe.pendingNonce !== null ||
    (!deploymentStatus.isDeployed && !isOrganization);

  return !isReady || !deploymentStatus.isReady || isTransferPending ? (
    <ButtonSend isPending to={sendPath} />
  ) : isSendDisabled ? (
    <Tooltip
      arrow
      title={
        !deploymentStatus.isDeployed
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

const ProfileTrustButton = ({ address, trustStatus }) => {
  const safe = useSelector((state) => state.safe);

  const { isOrganization, isReady } = useIsOrganization(address);

  const isOwnAccount = safe.currentAccount === address;

  const [isTrustConfirmOpen, setIsTrustConfirmOpen] = useState(false);
  const [isRevokeTrustOpen, setIsRevokeTrustOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);

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
      {!isOrganization && !isOwnAccount && (
        <ButtonTrust
          handleRevokeTrustOpen={handleRevokeTrustOpen}
          handleTrustOpen={handleTrustOpen}
          isReady={isReady}
          trustStatus={trustStatus}
        />
      )}
    </Fragment>
  );
};

ProfileStatus.propTypes = {
  address: PropTypes.string.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  trustStatus: PropTypes.object.isRequired,
};

ProfileContent.propTypes = {
  address: PropTypes.string.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
  trustStatus: PropTypes.object.isRequired,
};

ProfileContentActivity.propTypes = {
  address: PropTypes.string.isRequired,
};

ProfileContentTrustedBy.propTypes = {
  onSelect: PropTypes.func.isRequired,
  trustStatus: PropTypes.object.isRequired,
};

ProfileSendButton.propTypes = {
  address: PropTypes.string.isRequired,
  deploymentStatus: PropTypes.object.isRequired,
};

ProfileTrustButton.propTypes = {
  address: PropTypes.string.isRequired,
  trustStatus: PropTypes.object.isRequired,
};

export default Profile;
