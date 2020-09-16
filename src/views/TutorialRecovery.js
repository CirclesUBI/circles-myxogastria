import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { SETTINGS_KEYS, finishTutorial } from '~/store/tutorial/actions';
import { SpacingStyle } from '~/styles/Layout';

const TutorialRecovery = (props) => {
  const dispatch = useDispatch();

  const slides = [
    <SlideAccountRecovery key="accountRecovery" />,
    <SlideLinkingDevices key="linkingDevices" />,
    <SlideSeedPhrase key="seedPhrase" />,
  ];

  const onExit = () => {
    props.onExit();
  };

  const onFinish = () => {
    dispatch(finishTutorial(SETTINGS_KEYS));
  };

  return (
    <Tutorial isSkippable slides={slides} onExit={onExit} onFinish={onFinish} />
  );
};

const SlideAccountRecovery = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialRecovery.accountRecoveryTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialRecovery.accountRecovery')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideLinkingDevices = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialRecovery.linkingDevicesTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialRecovery.linkingDevices')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideSeedPhrase = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialRecovery.seedPhraseTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialRecovery.seedPhrase')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

TutorialRecovery.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialRecovery;
