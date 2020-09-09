import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { addSafeOwner } from '~/store/safe/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

const SettingsKeysAdd = () => {
  const dispatch = useDispatch();

  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');

  const onQRCodeScanned = (address) => {
    setOwnerAddress(address);
    setIsConfirmationShown(true);
  };

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(addSafeOwner(ownerAddress));

      dispatch(
        notify({
          text: translate('SettingsKeysAdd.successMessage'),
        }),
      );

      setIsDone(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('SettingsKeysAdd.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  const onPrevious = () => {
    setIsConfirmationShown(false);
  };

  if (isDone) {
    return <Redirect to="/settings/keys" />;
  }

  if (isConfirmationShown) {
    return (
      <Fragment>
        <Header>
          <ButtonBack onClick={onPrevious} />
          {translate('SettingsKeysAdd.addDevice')}
          <ButtonHome />
        </Header>

        <View>
          <p>
            {translate('SettingsKeysAdd.confirmationText', {
              address: ownerAddress,
            })}
          </p>

          <ButtonPrimary onClick={onSubmit}>
            {translate('SettingsKeysAdd.submit')}
          </ButtonPrimary>
        </View>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/settings/keys" />
        {translate('SettingsKeysAdd.addDevice')}
        <ButtonHome />
      </Header>

      <View>
        <QRCodeScanner onSuccess={onQRCodeScanned} />
      </View>
    </Fragment>
  );
};

export default SettingsKeysAdd;
