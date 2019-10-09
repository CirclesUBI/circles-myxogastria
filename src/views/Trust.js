import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import SafeFinderView from '~/components/SafeFinderView';

const Trust = () => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = address => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/trust/${safeAddress}`} />;
  }
  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>

      <SafeFinderView onSelect={onSelect} />
    </Fragment>
  );
};

Trust.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Trust;
