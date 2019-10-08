import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';

const SettingsKeys = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View>
        <h1>{context.t('SettingsKeys.manageKeys')}</h1>
        <p>{context.t('SettingsKeys.devicesAccessingAccount')}</p>

        <SafeOwnerManager />

        <Link to="/settings/keys/export">
          <Button>{context.t('SettingsKeys.exportSeedPhrase')}</Button>
        </Link>

        <Button onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </Button>
      </View>
    </Fragment>
  );
};

SettingsKeys.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeys;
