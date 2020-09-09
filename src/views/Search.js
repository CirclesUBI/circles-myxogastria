import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import SafeFinder from '~/components/SafeFinder';
import translate from '~/services/locale';

const Search = () => {
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
        {translate('Search.title')}
      </Header>

      <SafeFinder onSelect={onSelect} />
    </Fragment>
  );
};

export default Search;
