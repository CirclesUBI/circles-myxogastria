import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';
import { finalizeNewAccount } from '~/store/onboarding/actions';

import background from '%/images/background-green.svg';

const SettingsKeys = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  // @TODO: Remove this when we've implemented all of the onboarding flows
  const onDeploy = () => {
    dispatch(finalizeNewAccount());
  };

  return (
    <BackgroundStyle>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View isHeader>
        <h1>{context.t('SettingsKeys.manageKeys')}</h1>
        <p>{context.t('SettingsKeys.devicesAccessingAccount')}</p>

        <SafeOwnerManager />

        <ButtonPrimary to="/settings/keys/export">
          {context.t('SettingsKeys.exportSeedPhrase')}
        </ButtonPrimary>

        <ButtonPrimary onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </ButtonPrimary>

        <ButtonPrimary disabled={!safe.nonce} isOutline onClick={onDeploy}>
          Debug: Deploy Safe
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
