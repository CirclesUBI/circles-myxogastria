import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import HeaderButton from '~/components/HeaderButton';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import RoundButton from '~/components/RoundButton';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import styles from '~/styles/variables';
import { IconKeys, IconShare } from '~/styles/Icons';

import background from '~/../assets/images/background-green.svg';

const Settings = (props, context) => {
  const safe = useSelector(state => state.safe);

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
        <SpacingStyle>
          <QRCode data={safe.address} />
        </SpacingStyle>

        <RoundButton to="/settings/share">
          <IconShare />
          <span>{context.t('Settings.share')}</span>
        </RoundButton>

        <SpacingStyle>
          <LocaleSelector />
        </SpacingStyle>

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

const SpacingStyle = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

export default Settings;
