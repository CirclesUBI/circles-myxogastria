import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import BackButton from '~/components/BackButton';
import SafeFinderView from '~/components/SafeFinderView';
import { BackgroundPurpleTop } from '~/styles/Background';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Trust = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = address => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/trust/${safeAddress}`} />;
  }
  return (
    <BackgroundPurpleTop>
      <Header>
        <BackButton to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>{context.t('Trust.trustSomeone')}</HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <SafeFinderView isHeader onSelect={onSelect} />
    </BackgroundPurpleTop>
  );
};

Trust.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Trust;
