import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import BackButton from '~/components/BackButton';

const Activities = () => {
  return (
    <Fragment>
      <BackButton to="/" />
    </Fragment>
  );
};

Activities.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Activities;
