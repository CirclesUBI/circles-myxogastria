import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import LocaleSelector from '~/components/LocaleSelector';
import View from '~/components/View';

const Welcome = (props, context) => {
  return (
    <Fragment>
      <View>
        <h1>{context.t('Welcome.welcomeToCircles')}</h1>
        <p>{context.t('Welcome.haveWalletAlready')}</p>

        <ButtonPrimary to="/welcome/connect">
          {context.t('Welcome.connectYourWallet')}
        </ButtonPrimary>

        <p>{context.t('Welcome.noCirclesWallet')}</p>

        <ButtonPrimary to="/welcome/new">
          {context.t('Welcome.createNewWallet')}
        </ButtonPrimary>

        <LocaleSelector />
        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

Welcome.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Welcome;
