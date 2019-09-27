import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';

const Activities = () => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>
    </Fragment>
  );
};

Activities.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Activities;
