import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';

import background from '~/../assets/images/background-green.svg';

const SettingsKeys = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <BackgroundStyle>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View>
        <h1>{context.t('SettingsKeys.manageKeys')}</h1>
        <p>{context.t('SettingsKeys.devicesAccessingAccount')}</p>

        <SafeOwnerManager />

        <ButtonPrimary to="/settings/keys/export">
          {context.t('SettingsKeys.exportSeedPhrase')}
        </ButtonPrimary>

        <ButtonPrimary onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </ButtonPrimary>
      </View>
    </BackgroundStyle>
  );
};

SettingsKeys.contextTypes = {
  t: PropTypes.func.isRequired,
};

const BackgroundStyle = styled.div`
  height: 100%;

  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`;

export default SettingsKeys;
