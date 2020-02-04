import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import { SETTINGS_KEYS, finishTutorial } from '~/store/tutorial/actions';
import { IconKeys, IconDevices, IconSeed } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';

const TutorialSettingsKeys = props => {
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

  return <Tutorial slides={slides} onExit={onExit} onFinish={onFinish} />;
};

const SlideAccountRecovery = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle isLargeTop>
        <IconKeys isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialSettingsKeys.accountRecoveryTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialSettingsKeys.accountRecovery')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideLinkingDevices = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle isLargeTop>
        <IconDevices isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialSettingsKeys.linkingDevicesTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialSettingsKeys.linkingDevices')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideSeedPhrase = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle isLargeTop>
        <IconSeed isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialSettingsKeys.seedPhraseTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialSettingsKeys.seedPhrase')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

TutorialSettingsKeys.propTypes = {
  onExit: PropTypes.func.isRequired,
};

SlideAccountRecovery.contextTypes = {
  t: PropTypes.func.isRequired,
};

SlideLinkingDevices.contextTypes = {
  t: PropTypes.func.isRequired,
};

SlideSeedPhrase.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default TutorialSettingsKeys;
