import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';

const SettingsKeys = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    // @TODO: Use a proper modal here
    if (window.confirm('Are you sure?')) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View>
        <Button onClick={onBurnClick}>
          {context.t('views.settings.burn')}
        </Button>

        <Link to="/settings/keys/export">
          <Button>{context.t('views.settings.export')}</Button>
        </Link>
      </View>
    </Fragment>
  );
};

SettingsKeys.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeys;
