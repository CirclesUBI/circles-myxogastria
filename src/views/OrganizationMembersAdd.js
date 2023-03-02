import { Container } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ORGANIZATION_MEMBERS_ADD_PATH } from '~/routes';

import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import DialogAddMember from '~/components/DialogAddMember';
import Finder from '~/components/Finder';
import Header from '~/components/Header';
import View from '~/components/View';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { addSafeOwner } from '~/store/safe/actions';

const OrganizationMembersAdd = () => {
  const dispatch = useDispatch();
  const safe = useSelector((state) => state.safe);

  const [address, setAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [filteredSafeAddresses, setFilteredSafeAddresses] = useState([]);
  const { username } = useUserdata(address);

  // Prepare filter so it removes all search results which are already
  // organization members
  useEffect(() => {
    const update = async () => {
      const result = await core.organization.getMembers(safe.currentAccount);

      setFilteredSafeAddresses(
        result.reduce((acc, item) => {
          return acc.concat(item.safeAddresses);
        }, []),
      );
    };

    update();
  }, [safe.currentAccount]);

  const handleSelect = async (value) => {
    dispatch(showSpinnerOverlay());

    const result = await core.organization.isOrganization(value);
    setIsOrganization(result);
    setAddress(value);
    setIsOpen(true);

    dispatch(hideSpinnerOverlay());
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
          type: NotificationsTypes.INFO,
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
      <DialogAddMember
        address={address}
        handleAddMember={handleAddMember}
        handleClose={handleClose}
        isOpen={isOpen}
        isOrganization={isOrganization}
        username={username}
      />
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
            filteredSafeAddresses={filteredSafeAddresses}
            onSelect={handleSelect}
          />
        </Container>
      </View>
    </Fragment>
  );
};

export default OrganizationMembersAdd;
