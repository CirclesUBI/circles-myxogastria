import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import notify from '~/store/notifications/actions';
import { addSafeOwner } from '~/store/safe/actions';

const SettingsKeysAdd = (props, context) => {
  const dispatch = useDispatch();

  const [isDone, setIsDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSuccess = async address => {
    setIsLoading(true);

    try {
      await dispatch(addSafeOwner(address));

      dispatch(
        notify({
          text: context.t('SettingsKeysAdd.successMessage'),
        }),
      );

      setIsDone(true);
    } catch {
      dispatch(
        notify({
          text: context.t('SettingsKeysAdd.errorMessage'),
        }),
      );
    }

    setIsLoading(false);
  };

  if (isDone) {
    return <Redirect to="/settings/keys" />;
  }

  return (
    <Fragment>
      <Header>
        <BackButton disabled={isLoading} to="/settings/keys" />
      </Header>

      <View>
        <QRCodeScanner disabled={isLoading} onSuccess={onSuccess} />
      </View>
    </Fragment>
  );
};

SettingsKeysAdd.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysAdd;
