import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import HeaderButton from '~/components/HeaderButton';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import styles from '~/styles/variables';
import { IconKeys } from '~/styles/Icons';
import { finalizeNewAccount } from '~/store/onboarding/actions';

import background from '~/../assets/images/background-green.svg';

const Settings = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  // @TODO: Remove this when we've implemented all of the onboarding flows
  const onDeploy = () => {
    dispatch(finalizeNewAccount());
  };

  return (
    <BackgroundStyle>
      <Header>
        <BackButton to="/" />

        <HeaderUsernameStyle>
          <UsernameDisplay address={safe.address} />
        </HeaderUsernameStyle>

        <HeaderButton to="/settings/keys">
          <IconKeys />
        </HeaderButton>
      </Header>

      <View isHeader>
        <QRCode data={safe.address} />

        <ButtonPrimary to="/settings/share">
          {context.t('Settings.share')}
        </ButtonPrimary>

        <ButtonPrimary disabled={!safe.nonce} isOutline onClick={onDeploy}>
          Debug: Deploy Safe
        </ButtonPrimary>

        <LocaleSelector />
        <ExternalLinkList />
      </View>
    </BackgroundStyle>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

const BackgroundStyle = styled.div`
  @media ${styles.media.desktop} {
    background-position: 0 -50rem;
  }

  height: 100%;

  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: 0 -20rem;
  background-size: 100%;
`;

const HeaderUsernameStyle = styled.div`
  color: ${styles.monochrome.white};

  font-size: 1.5em;
`;

export default Settings;
