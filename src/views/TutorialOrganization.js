import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import { ORGANIZATION_CREATE, finishTutorial } from '~/store/tutorial/actions';

const TutorialOrganization = (props) => {
  const dispatch = useDispatch();

  const slides = [<p key="todo">TODO</p>];

  const onExit = () => {
    props.onExit();
  };

  const onFinish = () => {
    dispatch(finishTutorial(ORGANIZATION_CREATE));
  };

  return (
    <Tutorial isSkippable slides={slides} onExit={onExit} onFinish={onFinish} />
  );
};

TutorialOrganization.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialOrganization;
