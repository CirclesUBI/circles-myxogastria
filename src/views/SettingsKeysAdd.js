import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import HomeButton from '~/components/HomeButton';
import QRCodeScanner from '~/components/QRCodeScanner';
import View from '~/components/View';
import notify from '~/store/notifications/actions';
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
    } catch {
      dispatch(
        notify({
          text: context.t('SettingsKeysAdd.errorMessage'),
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  if (isDone) {
    return <Redirect to="/settings/keys" />;
  }

  return (
    <Fragment>
      <Header>
        <BackButton isDark to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('SettingsKeysAdd.addDevice')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton isDark />
      </Header>

      <View isHeader>
        <QRCodeScanner onSuccess={onQRCodeScanned} />
      </View>
    </Fragment>
  );
};

SettingsKeysAdd.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysAdd;
