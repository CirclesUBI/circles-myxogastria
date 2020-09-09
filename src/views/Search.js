import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import SafeFinder from '~/components/SafeFinder';

const Search = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/profile/${safeAddress}`} />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        {context.t('Search.title')}
      </Header>

      <SafeFinder onSelect={onSelect} />
    </Fragment>
  );
};

Search.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Search;
