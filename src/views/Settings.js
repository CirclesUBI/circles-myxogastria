import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';

const Settings = (props, context) => {
  return (
    <Fragment>
      <BackButton to="/" />

      <Link to="/settings/keys">
        <Button>{context.t('views.settings.keys')}</Button>
      </Link>
    </Fragment>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
