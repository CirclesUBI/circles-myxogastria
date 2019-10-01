import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import { addSafeOwner } from '~/store/safe/actions';

const SettingsKeysAdd = () => {
  const dispatch = useDispatch();

  const onSuccess = address => {
    // @TODO: Use a proper modal here
    if (window.confirm('Are you sure?')) {
      dispatch(addSafeOwner(address));
    }
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
