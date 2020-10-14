import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { AvatarGroup } from '@material-ui/lab';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import ButtonAction from '~/components/ButtonAction';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Dialog from '~/components/Dialog';
import Header from '~/components/Header';
import View from '~/components/View';
import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { IconTrust, IconClose } from '~/styles/icons';
import { ORGANIZATION_MEMBERS_ADD_PATH } from '~/routes';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { removeSafeOwner } from '~/store/safe/actions';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';

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
}));

const OrganizationMembers = () => {
  const safe = useSelector((state) => state.safe);

  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const request = async () => {
      setIsLoading(true);
      const result = await core.organization.getMembers(safe.currentAccount);
      setMembers(result);
      setIsLoading(false);
    };

    request();
  }, [safe.currentAccount]);

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
            members.map((member) => {
              return (
                <OrganizationMembersItem
                  isOnlyMember={members.length === 1}
                  key={member.ownerAddress}
                  ownerAddress={member.ownerAddress}
                  safeAddresses={member.safeAddresses}
                />
              );
            })
          )}
        </Container>
      </View>
      <ButtonAction
        aria-label="Add member"
        component={Link}
        to={ORGANIZATION_MEMBERS_ADD_PATH}
      >
        <IconTrust fontSize="large" />
      </ButtonAction>
    </Fragment>
  );
};

const OrganizationMembersItem = ({
  safeAddresses,
  ownerAddress,
  isOnlyMember,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
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
    try {
      dispatch(showSpinnerOverlay());

      await dispatch(removeSafeOwner(ownerAddress));

      dispatch(
        notify({
          text: translate('OrganizationMembers.successRemovedMember', {
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );
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

  return (
    <Card>
      <Dialog
        cancelLabel={translate('OrganizationMembers.dialogCancel')}
        confirmLabel={translate('OrganizationMembers.dialogConfirm')}
        id="remove-member"
        open={isOpen}
        text={translate('OrganizationMembers.dialogRemoveMember', {
          username,
        })}
        title={translate('OrganizationMembers.dialogTitle', {
          username,
        })}
        onClose={handleClose}
        onConfirm={handleRemove}
      />
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
  ownerAddress: PropTypes.string.isRequired,
  safeAddresses: PropTypes.array.isRequired,
};

export default OrganizationMembers;
