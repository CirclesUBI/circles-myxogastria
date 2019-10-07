import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import notify from '~/store/notifications/actions';
import { addSafeOwner } from '~/store/safe/actions';

const SettingsKeysAdd = (props, context) => {
  const dispatch = useDispatch();

  const onSuccess = address => {
    dispatch(addSafeOwner(address));

    dispatch(
      notify({
        text: context.t('SettingsKeysAdd.successMessage'),
      }),
    );
  };

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings/keys" />
      </Header>

      <View>
        <QRCodeScanner onSuccess={onSuccess} />
      </View>
    </Fragment>
  );
};

SettingsKeysAdd.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysAdd;
