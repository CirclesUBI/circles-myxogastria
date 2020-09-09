import React, { Fragment } from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';
import { SpacingStyle } from '~/styles/Layout';

const Welcome = () => {
  return (
    <Fragment>
      <Header>
        <LocaleSelector />
      </Header>

      <View>
        <SpacingStyle>
          <Logo isWithGang />
        </SpacingStyle>

        <SpacingStyle>
          <h1>{translate('Welcome.welcomeToCircles')}</h1>
        </SpacingStyle>

        <p>{translate('Welcome.haveWalletAlready')}</p>

        <ButtonPrimary to="/welcome/connect">
          {translate('Welcome.connectYourWallet')}
        </ButtonPrimary>

        <SpacingStyle isLargeBottom>
          <p>{translate('Welcome.noCirclesWallet')}</p>

          <ButtonPrimary isOutline to="/welcome/onboarding">
            {translate('Welcome.createNewWallet')}
          </ButtonPrimary>
        </SpacingStyle>

        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

export default Welcome;
