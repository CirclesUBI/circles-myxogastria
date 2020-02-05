import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import ButtonHome from '~/components/ButtonHome';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import styles from '~/styles/variables';
import { BackgroundGreenTop } from '~/styles/Background';
import { ButtonStyle } from '~/components/Button';
import { burnApp } from '~/store/app/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

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
        <ButtonBack to="/settings" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('SettingsKeys.manageKeys')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHome />
      </Header>

      <View isFooter isHeader>
        <SafeOwnerManager />

        <DangerButtonStyle onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </DangerButtonStyle>

        <small>
          v. {process.env.RELEASE_VERSION} ({process.env.CORE_RELEASE_VERSION})
        </small>
      </View>

      <Footer>
        <ButtonPrimary isOutline to="/settings/keys/export">
          {context.t('SettingsKeys.exportSeedPhrase')}
        </ButtonPrimary>
      </Footer>
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
