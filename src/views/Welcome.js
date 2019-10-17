import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';

import ButtonPrimary from '~/components/ButtonPrimary';
import ExternalLinkList from '~/components/ExternalLinkList';
import LocaleSelector from '~/components/LocaleSelector';
import View from '~/components/View';
import { HeaderStyle } from '~/components/Header';
import { SpacingStyle } from '~/styles/Layout';

import circlesPeople from '%/images/circles-people.png';

const Welcome = (props, context) => {
  return (
    <Fragment>
      <WelcomeHeaderStyle>
        <LocaleSelector />
      </WelcomeHeaderStyle>

      <View isHeader isPushingToBottom>
        <CirclesPeopleStyle />

        <SpacingStyle>
          <h1>{context.t('Welcome.welcomeToCircles')}</h1>
        </SpacingStyle>

        <p>{context.t('Welcome.haveWalletAlready')}</p>

        <ButtonPrimary to="/welcome/connect">
          {context.t('Welcome.connectYourWallet')}
        </ButtonPrimary>

        <SpacingStyle>
          <p>{context.t('Welcome.noCirclesWallet')}</p>

          <ButtonPrimary isOutline to="/welcome/new">
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

export const WelcomeHeaderStyle = styled(HeaderStyle)`
  padding-right: 2rem;

  justify-content: flex-end;
`;

export const CirclesPeopleStyle = styled.div`
  width: 18rem;
  height: 18rem;

  margin: 0 auto;

  background-image: url(${circlesPeople});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  flex-shrink: 0;
`;

export default Welcome;
