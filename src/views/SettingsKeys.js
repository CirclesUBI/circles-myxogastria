import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import HomeButton from '~/components/HomeButton';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { finalizeNewAccount } from '~/store/onboarding/actions';

import {
  burnApp,
  hideSpinnerOverlay,
  showSpinnerOverlay,
} from '~/store/app/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const SettingsKeys = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  // @TODO: Remove this when we've implemented all of the onboarding flows
  const onDeploy = async () => {
    dispatch(showSpinnerOverlay());
    await dispatch(finalizeNewAccount());
    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <Header>
        <BackButton isDark to="/settings" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('SettingsKeys.manageKeys')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton isDark />
      </Header>

      <View isFooter isHeader>
        <p>{context.t('SettingsKeys.devicesAccessingAccount')}</p>

        <SafeOwnerManager />

        <DangerButtonStyle onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </DangerButtonStyle>

        <ButtonPrimary disabled={!safe.nonce} isOutline onClick={onDeploy}>
          Debug: Deploy Safe
        </ButtonPrimary>
      </View>

      <Footer>
        <ButtonPrimary isOutline to="/settings/keys/export">
          {context.t('SettingsKeys.exportSeedPhrase')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

SettingsKeys.contextTypes = {
  t: PropTypes.func.isRequired,
};

const DangerButtonStyle = styled(ButtonStyle)`
  margin: 2rem;
  padding: 1rem;
  padding-right: 2rem;
  padding-left: 2rem;

  border: 1px solid #f00;
  border-radius: 10px;

  color: #f00;

  font-weight: ${styles.base.typography.weightLight};
  font-size: 0.8em;
`;

export default SettingsKeys;
