import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';

const Receive = () => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>
    </Fragment>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
