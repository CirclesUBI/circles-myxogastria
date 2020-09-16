import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import translate from '~/services/locale';
import { burnApp } from '~/store/app/actions';

const Devices = () => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(translate('Devices.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <Header>
        {translate('Devices.manageKeys')}
        <ButtonHome />
      </Header>
      <View>
        <SafeOwnerManager />
        <Button onClick={onBurnClick}>{translate('Devices.endSession')}</Button>
        <small>
          v. {process.env.RELEASE_VERSION} ({process.env.CORE_RELEASE_VERSION})
        </small>
      </View>
    </Fragment>
  );
};

export default Devices;
