import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import { burnApp } from '~/store/app/actions';

const Settings = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    // @TODO: Use a proper modal here
    if (window.confirm('Are you sure?')) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <BackButton />
      <Button onClick={onBurnClick}>{context.t('views.settings.burn')}</Button>

      <Link to="/settings/export">
        <Button>{context.t('views.settings.export')}</Button>
      </Link>
    </Fragment>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
