import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonRound from '~/components/ButtonRound';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { BackgroundGreenTop } from '~/styles/Background';
import { SpacingStyle } from '~/styles/Layout';

const Settings = (props, context) => {
  const safe = useSelector((state) => state.safe);

  return (
    <BackgroundGreenTop>
      <Header>
        <ButtonBack to="/" />
        <UsernameDisplay address={safe.currentAccount} />
      </Header>

      <View>
        <SpacingStyle>
          <QRCode data={safe.currentAccount} />
        </SpacingStyle>

        <SpacingStyle>
          <p>{context.t('Settings.showThisQR')}</p>
        </SpacingStyle>

        <ButtonRound to="/settings/share">
          <span>{context.t('Settings.share')}</span>
        </ButtonRound>

        <SpacingStyle>
          <LocaleSelector />
        </SpacingStyle>

        <ExternalLinkList />
      </View>
    </BackgroundGreenTop>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
