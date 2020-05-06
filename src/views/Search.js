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

const Search = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/profile/${safeAddress}`} />;
  }

  return (
    <BackgroundPurpleTop>
      <Header>
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>{context.t('Search.title')}</HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <SafeFinder isHeader onSelect={onSelect} />
    </BackgroundPurpleTop>
  );
};

Search.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Search;
