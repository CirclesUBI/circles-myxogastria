import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';

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
    dispatch(finishTutorial(ACCOUNT_CREATE));
  };

  return <Tutorial slides={slides} onExit={onExit} onFinish={onFinish} />;
};

const SlideAccountRecovery = () => {
  return (
    <Fragment>
      <h3>Test A</h3>
    </Fragment>
  );
};

const SlideLinkingDevices = () => {
  return (
    <Fragment>
      <h3>Test B</h3>
    </Fragment>
  );
};

const SlideSeedPhrase = () => {
  return (
    <Fragment>
      <h3>Test C</h3>
    </Fragment>
  );
};

TutorialSettingsKeys.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialSettingsKeys;
