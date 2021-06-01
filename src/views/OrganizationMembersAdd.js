import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, makeStyles, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import PurpleDialog from '~/components/PurpleDialog';
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
}));

const OrganizationMembersAdd = () => {
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const { username } = useUserdata(address);

  const classes = useParagraphStyles();

  const handleSelect = (value) => {
    setAddress(value);
  };

  const handleClose = () => {
    setAddress(null);
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

    setAddress(null);
    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <PurpleDialog
        okButtonLabel="Trust"
        open
        title="Add @Dinesh"
        onCancelClick={handleClose}
        onOkClick={handleAddMember}
      >
        <Typography classes={classes} paragraph>
          {t('OrganizationMembersAdd.trustDialogInfo')}
        </Typography>
        <Link to="https://www.joincircles.net/faq">
          <Typography classes={classes} paragraph>
            {t('OrganizationMembersAdd.learnMore')}
          </Typography>
        </Link>
      </PurpleDialog>
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
