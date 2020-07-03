import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import ButtonRound from '~/components/ButtonRound';
import Spinner from '~/components/Spinner';
import { FAQ_URL } from '~/components/ExternalLinkList';
import { IconSeed } from '~/styles/Icons';
import { finalizeNewAccount } from '~/store/onboarding/actions';

const OnboardingStatus = (props, context) => {
  const dispatch = useDispatch();
  const { safe, trust, token } = useSelector((state) => state);

  // Safe and Token is already deployed?
  const isFinished = !safe.nonce && safe.address && token.address;

  // We can attempt an deployment if one of two
  // conditions is met:
  //
  // 1. We have enough incoming trust connections,
  // therefore the Relayer will pay for our fees
  // 2. We funded the Safe ourselves manually
  const isReady = safe.isFunded || trust.isTrusted;

  // Is deployment currently happening?!
  const isPending = safe.isLocked;

  const onDeploy = () => {
    dispatch(finalizeNewAccount());
  };

  if (isFinished) {
    return;
  }

  return (
    <OnboardingStatusStyle>
      {isPending ? (
        <Fragment>
          <p>{context.t('OnboardingStatus.pendingDeployment')}</p>
          <Spinner isDark />
        </Fragment>
      ) : isReady ? (
        <Fragment>
          <p>{context.t('OnboardingStatus.readyForDeployment')}</p>

          <ButtonRound onClick={onDeploy}>
            <IconSeed />
            <span>{context.t('OnboardingStatus.startDeploymentButton')}</span>
          </ButtonRound>
        </Fragment>
      ) : trust.isReady ? (
        <Fragment>
          <p>
            {context.t('OnboardingStatus.trustDescription', {
              connections: trust.connections,
              left: Math.max(0, 3 - trust.connections),
            })}{' '}
            <a href={FAQ_URL} rel="noopener noreferrer" target="_blank">
              {context.t('OnboardingStatus.learnMore')}
            </a>
          </p>
        </Fragment>
      ) : (
        <Spinner isDark />
      )}
    </OnboardingStatusStyle>
  );
};

OnboardingStatus.contextTypes = {
  t: PropTypes.func.isRequired,
};

const OnboardingStatusStyle = styled.div``;

export default OnboardingStatus;
