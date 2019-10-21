import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
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

  const [isDone, setIsDone] = useState(false);

  const onQRCodeScanned = async address => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(addSafeOwner(address));

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

  if (isDone) {
    return <Redirect to="/settings/keys" />;
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
