import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import SafeFinder from '~/components/SafeFinder';

const Send = (props, context) => {
  const [safeAddress, setSafeAddress] = useState('');

  const onSelect = (address) => {
    setSafeAddress(address);
  };

  if (safeAddress) {
    return <Redirect to={`/send/${safeAddress}`} />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        {context.t('Send.sendCircles')}
      </Header>

      <SafeFinder onSelect={onSelect} />
    </Fragment>
  );
};

Send.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Send;
