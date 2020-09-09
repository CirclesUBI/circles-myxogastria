import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import SafeOwnerManager from '~/components/SafeOwnerManager';
import View from '~/components/View';
import styles from '~/styles/variables';
import translate from '~/services/locale';
import { ButtonStyle } from '~/components/Button';
import { burnApp } from '~/store/app/actions';

const SettingsKeys = () => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(translate('SettingsKeys.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <Header>
        {translate('SettingsKeys.manageKeys')}
        <ButtonHome />
      </Header>

      <View>
        <SafeOwnerManager />

        <DangerButtonStyle onClick={onBurnClick}>
          {translate('SettingsKeys.endSession')}
        </DangerButtonStyle>

        <small>
          v. {process.env.RELEASE_VERSION} ({process.env.CORE_RELEASE_VERSION})
        </small>
      </View>
    </Fragment>
  );
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
