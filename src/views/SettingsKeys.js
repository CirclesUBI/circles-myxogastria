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
import { BackgroundGreen } from '~/styles/Background';
import { ButtonStyle } from '~/components/Button';
import { burnApp } from '~/store/app/actions';
import { finalizeNewAccount } from '~/store/onboarding/actions';

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
    <BackgroundGreen>
      <Header>
        <BackButton to="/settings" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('SettingsKeys.manageKeys')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton />
      </Header>

      <View isFooter isHeader>
        <SafeOwnerManager />

        <DangerButtonStyle onClick={onBurnClick}>
          {context.t('SettingsKeys.endSession')}
        </DangerButtonStyle>

        <DebugButtons />

        <small>
          v. {process.env.RELEASE_VERSION} ({process.env.CORE_RELEASE_VERSION})
        </small>
      </View>

      <Footer>
        <ButtonPrimary isOutline to="/settings/keys/export">
          {context.t('SettingsKeys.exportSeedPhrase')}
        </ButtonPrimary>
      </Footer>
    </BackgroundGreen>
  );
};

const DebugButtons = () => {
  if (
    process.env.NODE_ENV === 'production' &&
    !window.location.search.includes('?debug') // @TODO Remove this
  ) {
    return null;
  }

  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const onDeploy = async () => {
    await dispatch(finalizeNewAccount());
  };

  return (
    <Fragment>
      <ButtonPrimary
        disabled={!safe.nonce || safe.isLocked}
        isOutline
        onClick={onDeploy}
      >
        Debug: Deploy Safe
      </ButtonPrimary>
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
