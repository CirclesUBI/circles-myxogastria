import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { AvatarGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ORGANIZATION_MEMBERS_ADD_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import ButtonAction from '~/components/ButtonAction';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import DialogPurple from '~/components/DialogPurple';
import Header from '~/components/Header';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  hideSpinnerOverlay,
  showSpinnerOverlay,
  switchAccount,
} from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { removeSafeOwner } from '~/store/safe/actions';
import { IconClose, IconTrust } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1),
  },
  cardActionButton: {
    marginTop: theme.spacing(1.1),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(1),
    borderRadius: 7,
    color: theme.palette.primary.main,
    textTransform: 'none',
    fontSize: 12,
  },
  cardActionIcon: {
    color: theme.palette.primary.main,
    fontSize: 14,
  },
  fab: {
    width: 72,
    height: 72,
    position: 'fixed',
    bottom: theme.spacing(2.25),
    right: theme.spacing(2.25),
    background: theme.custom.gradients.purple,
  },
  buttonActionTrustIcon: {
    color: theme.custom.colors.whiteAlmost,
    position: 'relative',
  },
  paragraph: {
    color: theme.custom.colors.grayLightest,
  },
}));

// Helper method to find out if a user is still a member of an organization
function isMemberOfOrganization(members, currentAccounts) {
  return members.some(({ safeAddresses }) => {
    return currentAccounts.some((safeAddress) =>
      safeAddresses.includes(safeAddress),
    );
  });
}

const OrganizationMembers = () => {
  const classes = useStyles();

  const safe = useSelector((state) => state.safe);
  const dispatch = useDispatch();

  const [members, setMembers] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useUpdateLoop(async () => {
    handleUpdate();
  });

  const handleUpdate = useCallback(async () => {
    setIsLoading(true);

    // Get a list of all Safe owners of this organization
    const result = await core.organization.getMembers(safe.currentAccount);

    // Filter out the owner we just removed
    const updatedMembers = result.filter((member) => {
      return (
        member.safeAddresses.length > 0 &&
        !removedMembers.includes(member).ownerAddress
      );
    });

    setMembers(updatedMembers);
    setIsLoading(false);

    // Finally check if we are still owner of that organization, otherwise
    // switch to another account automatically as we don't have anything to do
    // here anymore!
    if (!isMemberOfOrganization(updatedMembers, safe.accounts)) {
      dispatch(
        switchAccount(
          safe.accounts.filter((account) => {
            return account !== safe.currentAccount;
          })[0],
        ),
      );
    }
  }, [safe.currentAccount, removedMembers, safe.accounts, dispatch]);

  const handleRemove = async (ownerAddress, username) => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(removeSafeOwner(ownerAddress));

      dispatch(
        notify({
          text: translate('OrganizationMembers.successRemovedMember', {
            username,
          }),
          type: NotificationsTypes.INFO,
        }),
      );

      // We keep track of it in a local list, so they UI can already hide it
      // away for us
      setRemovedMembers(removedMembers.concat(ownerAddress));
    } catch {
      dispatch(
        notify({
          text: translate('OrganizationMembers.errorRemovedMember', {
            username,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  useEffect(() => {
    handleUpdate();
  }, [handleUpdate]);

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('OrganizationMembers.headingMembers')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          {isLoading ? (
            <Box align="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {members.map((member) => {
                return (
                  <Grid item key={member.ownerAddress} xs={12}>
                    <OrganizationMembersItem
                      isOnlyMember={members.length === 1}
                      key={member.ownerAddress}
                      ownerAddress={member.ownerAddress}
                      safeAddresses={member.safeAddresses}
                      onRemove={handleRemove}
                    />
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </View>
      <ButtonAction
        aria-label="Add member"
        component={Link}
        to={ORGANIZATION_MEMBERS_ADD_PATH}
      >
        <IconTrust className={classes.buttonActionTrustIcon} fontSize="large" />
      </ButtonAction>
    </Fragment>
  );
};

const OrganizationMembersItem = ({
  safeAddresses,
  ownerAddress,
  isOnlyMember,
  onRemove,
}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const { username } = useUserdata(safeAddresses[0]);
  const profilePath = useRelativeProfileLink(safeAddresses[0]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRemove = async () => {
    onRemove(ownerAddress, username);
    setIsOpen(false);
  };

  return (
    <Card>
      <DialogPurple
        cancelLabel={translate('OrganizationMembers.dialogCancel')}
        confirmLabel={translate('OrganizationMembers.dialogConfirm')}
        open={isOpen}
        title={translate('OrganizationMembers.dialogTitle', {
          username,
        })}
        onClose={handleClose}
        onConfirm={handleRemove}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar address={safeAddresses[0]} size="medium" />
        </Box>
        <Typography className={classes.paragraph} paragraph>
          {translate('OrganizationMembers.dialogRemoveMember', { username })}
        </Typography>
      </DialogPurple>
      <CardHeader
        action={
          <Box display="flex">
            {!isOnlyMember && (
              <Button
                aria-label="Send"
                className={classes.cardActionButton}
                startIcon={<IconClose className={classes.cardActionIcon} />}
                variant="text"
                onClick={handleOpen}
              >
                {translate('OrganizationMembers.buttonRemoveMember')}
              </Button>
            )}
          </Box>
        }
        avatar={
          <Link to={profilePath}>
            <AvatarGroup max={4}>
              {safeAddresses.map((safeAddress) => {
                return (
                  <Avatar address={safeAddress} key={safeAddress} size="tiny" />
                );
              })}
            </AvatarGroup>
          </Link>
        }
        classes={{
          root: classes.cardHeader,
        }}
        subheader={`@${username}`}
      />
    </Card>
  );
};

OrganizationMembersItem.propTypes = {
  isOnlyMember: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  ownerAddress: PropTypes.string.isRequired,
  safeAddresses: PropTypes.array.isRequired,
};

export default OrganizationMembers;
