import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { addSafeOwner } from '~/store/safe/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

const DevicesAdd = () => {
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
          text: translate('DevicesAdd.successMessage'),
        }),
      );

      setIsDone(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('DevicesAdd.errorMessage'),
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
          {translate('DevicesAdd.addDevice')}
          <ButtonHome />
        </Header>
        <View>
          <p>
            {translate('DevicesAdd.confirmationText', {
              address: ownerAddress,
            })}
          </p>
          <Button onClick={onSubmit}>{translate('DevicesAdd.submit')}</Button>
        </View>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/settings/keys" />
        {translate('DevicesAdd.addDevice')}
        <ButtonHome />
      </Header>
      <View>
        <QRCodeScanner onSuccess={onQRCodeScanned} />
      </View>
    </Fragment>
  );
};

export default DevicesAdd;
