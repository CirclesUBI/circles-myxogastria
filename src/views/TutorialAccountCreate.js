import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';

const TutorialAccountCreate = props => {
  const dispatch = useDispatch();

  const slides = [
    <SlideCircles key="joiningCircles" />,
    <SlideWebOfTrust key="webOfTrust" />,
    <SlideUnderConstruction key="underConstruction" />,
  ];

  const onExit = () => {
    props.onExit();
  };

  const onFinish = () => {
    dispatch(finishTutorial(ACCOUNT_CREATE));
  };

  return <Tutorial slides={slides} onExit={onExit} onFinish={onFinish} />;
};

const SlideCircles = () => {
  return (
    <Fragment>
      <h3>Test A</h3>
    </Fragment>
  );
};

const SlideWebOfTrust = () => {
  return (
    <Fragment>
      <h3>Test B</h3>
    </Fragment>
  );
};

const SlideUnderConstruction = () => {
  return (
    <Fragment>
      <h3>Test C</h3>
    </Fragment>
  );
};

TutorialAccountCreate.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialAccountCreate;
