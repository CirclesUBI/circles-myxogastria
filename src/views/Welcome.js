import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Button from '~/components/Button';

const Welcome = (props, context) => {
  return (
    <Fragment>
      <Link to="/welcome/new">
        <Button>{context.t('views.welcome.new')}</Button>
      </Link>

      <Link to="/welcome/connect">
        <Button>{context.t('views.welcome.connect')}</Button>
      </Link>
    </Fragment>
  );
};

Welcome.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Welcome;
