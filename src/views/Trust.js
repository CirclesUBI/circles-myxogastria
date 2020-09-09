import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import SafeFinder from '~/components/SafeFinder';

const Trust = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/trust/${safeAddress}`} />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        {context.t('Trust.trustSomeone')}
      </Header>

      <SafeFinder onSelect={onSelect} />
    </Fragment>
  );
};

Trust.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Trust;
