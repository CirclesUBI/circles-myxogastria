import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import styles from '~/styles/variables';
import { BackgroundGreenTop } from '~/styles/Background';
import { ButtonStyle } from '~/components/Button';
import { burnApp } from '~/store/app/actions';

const SettingsKeys = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <BackgroundGreenTop>
      <Header>
        {context.t('SettingsKeys.manageKeys')}
        <ButtonHome />
      </Header>

      <View>
        <SafeOwnerManager />

        <DangerButtonStyle onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </DangerButtonStyle>

        <small>
          v. {process.env.RELEASE_VERSION} ({process.env.CORE_RELEASE_VERSION})
        </small>
      </View>
    </BackgroundGreenTop>
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

  border: 3px solid #faa;
  border-radius: 10px;

  color: #faa;

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 0.8em;
`;

export default SettingsKeys;
