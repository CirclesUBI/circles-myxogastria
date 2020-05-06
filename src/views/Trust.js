import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import SafeFinder from '~/components/SafeFinder';
import { BackgroundPurpleTop } from '~/styles/Background';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Trust = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/trust/${safeAddress}`} />;
  }
  return (
    <BackgroundPurpleTop>
      <Header>
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>{context.t('Trust.trustSomeone')}</HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <SafeFinder isHeader onSelect={onSelect} />
    </BackgroundPurpleTop>
  );
};

Trust.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Trust;
