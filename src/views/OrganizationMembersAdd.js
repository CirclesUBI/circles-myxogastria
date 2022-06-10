import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import MemberSearchAdd from '~/components/MemberSearchAdd';
import core from '~/services/core';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

const OrganizationMembersAdd = () => {
  const dispatch = useDispatch();
  const safe = useSelector((state) => state.safe);

  const [address, setAddress] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [filteredSafeAddresses, setFilteredSafeAddresses] = useState([]);

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

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('OrganizationMembersAdd.headingAddMember')}
        </CenteredHeading>
        <ButtonQRCodeScanner edge="end" onSelect={handleSelect} />
      </Header>
      <Fragment>
        <MemberSearchAdd />
      </Fragment>
    </Fragment>
  );
};

export default OrganizationMembersAdd;
