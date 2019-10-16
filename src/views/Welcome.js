import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';

import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import LocaleSelector from '~/components/LocaleSelector';
import View from '~/components/View';
import { HeaderStyle } from '~/components/Header';

const Welcome = (props, context) => {
  return (
    <Fragment>
      <WelcomeHeaderStyle>
        <LocaleSelector />
      </WelcomeHeaderStyle>

      <View isHeader isPushingToBottom>
        <h1>{context.t('Welcome.welcomeToCircles')}</h1>
        <p>{context.t('Welcome.haveWalletAlready')}</p>

        <ButtonPrimary to="/welcome/connect">
          {context.t('Welcome.connectYourWallet')}
        </ButtonPrimary>

        <p>{context.t('Welcome.noCirclesWallet')}</p>

        <ButtonPrimary isOutline to="/welcome/new">
          {context.t('Welcome.createNewWallet')}
        </ButtonPrimary>

        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

Welcome.contextTypes = {
  t: PropTypes.func.isRequired,
};

export const WelcomeHeaderStyle = styled(HeaderStyle)`
  padding-right: 2rem;

  justify-content: flex-end;
`;

export default Welcome;
