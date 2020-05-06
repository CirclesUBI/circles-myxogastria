import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import SafeFinder from '~/components/SafeFinder';
import { BackgroundOrangeTop } from '~/styles/Background';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Send = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/send/${safeAddress}`} />;
  }

  return (
    <BackgroundOrangeTop>
      <Header>
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>{context.t('Send.sendCircles')}</HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <SafeFinder isHeader onSelect={onSelect} />
    </BackgroundOrangeTop>
  );
};

Send.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Send;
