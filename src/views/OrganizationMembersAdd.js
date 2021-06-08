import React, { Fragment, useState } from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import DialogPurple from '~/components/DialogPurple';
import ExternalLink from '~/components/ExternalLink';
import Finder from '~/components/Finder';
import Header from '~/components/Header';
import View from '~/components/View';
import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { ORGANIZATION_MEMBERS_ADD_PATH } from '~/routes';
import { addSafeOwner } from '~/store/safe/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { useUserdata } from '~/hooks/username';

const useParagraphStyles = makeStyles((theme) => ({
  paragraph: {
    color: theme.custom.colors.grayLightest,
  },
  link: {
    color: theme.custom.colors.grayLightest,
  },
}));

const OrganizationMembersAdd = () => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { username } = useUserdata(address);

  const classes = useParagraphStyles();

  const handleSelect = (value) => {
    setAddress(value);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
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

  return (
    <Fragment>
      <DialogPurple
        cancelButtonLabel={translate('OrganizationMembersAdd.dialogCancel')}
        okButtonLabel={translate('OrganizationMembersAdd.dialogConfirm')}
        open={isOpen}
        title={translate('OrganizationMembersAdd.dialogTitle', { username })}
        onClose={handleClose}
        onConfirm={handleAddMember}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar address={address} size="medium" />
        </Box>
        <Typography className={classes.paragraph} paragraph>
          {translate('OrganizationMembersAdd.dialogBody')}
        </Typography>
        <ExternalLink
          className={classes.link}
          href="https://www.joincircles.net/faq"
          underline="always"
        >
          <Typography paragraph>
            {translate('OrganizationMembersAdd.linkLearnMore')}
          </Typography>
        </ExternalLink>
      </DialogPurple>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('OrganizationMembersAdd.headingAddMember')}
        </CenteredHeading>
        <ButtonQRCodeScanner edge="end" onSelect={handleSelect} />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Finder
            basePath={ORGANIZATION_MEMBERS_ADD_PATH}
            onSelect={handleSelect}
          />
        </Container>
      </View>
    </Fragment>
  );
};

export default OrganizationMembersAdd;
