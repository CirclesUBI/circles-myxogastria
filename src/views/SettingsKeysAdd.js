import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundGreenTop } from '~/styles/Background';
import { addSafeOwner } from '~/store/safe/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const SettingsKeysAdd = (props, context) => {
  const dispatch = useDispatch();

  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');

  const onQRCodeScanned = address => {
    setOwnerAddress(address);
    setIsConfirmationShown(true);
  };

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(addSafeOwner(ownerAddress));

      dispatch(
        notify({
          text: context.t('SettingsKeysAdd.successMessage'),
        }),
      );

      setIsDone(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: context.t('SettingsKeysAdd.errorMessage'),
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
      <BackgroundGreenTop>
        <Header>
          <ButtonBack onClick={onPrevious} />

          <HeaderCenterStyle>
            <HeaderTitleStyle>
              {context.t('SettingsKeysAdd.addDevice')}
            </HeaderTitleStyle>
          </HeaderCenterStyle>

          <ButtonHome />
        </Header>

        <View isHeader>
          <p>
            {context.t('SettingsKeysAdd.confirmationText', {
              address: ownerAddress,
            })}
          </p>

          <ButtonPrimary onClick={onSubmit}>
            {context.t('SettingsKeysAdd.submit')}
          </ButtonPrimary>
        </View>
      </BackgroundGreenTop>
    );
  }

  return (
    <BackgroundGreenTop>
      <Header>
        <ButtonBack to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('SettingsKeysAdd.addDevice')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHome />
      </Header>

      <View isHeader>
        <QRCodeScanner onSuccess={onQRCodeScanned} />
      </View>
    </BackgroundGreenTop>
  );
};

SettingsKeysAdd.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysAdd;
