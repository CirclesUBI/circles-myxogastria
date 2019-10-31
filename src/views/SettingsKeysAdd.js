import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import HomeButton from '~/components/HomeButton';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundGreen } from '~/styles/Background';
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
      <BackgroundGreen>
        <Header>
          <BackButton onClick={onPrevious} />

          <HeaderCenterStyle>
            <HeaderTitleStyle>
              {context.t('SettingsKeysAdd.addDevice')}
            </HeaderTitleStyle>
          </HeaderCenterStyle>

          <HomeButton />
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
      </BackgroundGreen>
    );
  }

  return (
    <BackgroundGreen>
      <Header>
        <BackButton to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('SettingsKeysAdd.addDevice')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton />
      </Header>

      <View isHeader>
        <QRCodeScanner onSuccess={onQRCodeScanned} />
      </View>
    </BackgroundGreen>
  );
};

SettingsKeysAdd.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysAdd;
