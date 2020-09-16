import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import SafeFinder from '~/components/SafeFinder';

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
      <SafeFinder onSelect={onSelect} />
    </Fragment>
  );
};

export default Search;
