import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import Logo from '~/components/Logo';
import View from '~/components/View';
import { SpacingStyle } from '~/styles/Layout';

const Welcome = (props, context) => {
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
          <h1>{context.t('Welcome.welcomeToCircles')}</h1>
        </SpacingStyle>

        <p>{context.t('Welcome.haveWalletAlready')}</p>

        <ButtonPrimary to="/welcome/connect">
          {context.t('Welcome.connectYourWallet')}
        </ButtonPrimary>

        <SpacingStyle isLargeBottom>
          <p>{context.t('Welcome.noCirclesWallet')}</p>

          <ButtonPrimary isOutline to="/welcome/onboarding">
            {context.t('Welcome.createNewWallet')}
          </ButtonPrimary>
        </SpacingStyle>

        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

Welcome.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Welcome;
