import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';

const Send = () => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>
    </Fragment>
  );
};

Send.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Send;
