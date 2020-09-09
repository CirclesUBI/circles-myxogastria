import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';
import { SpacingStyle } from '~/styles/Layout';

const TutorialAccountCreate = (props) => {
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

  return (
    <Tutorial isSkippable slides={slides} onExit={onExit} onFinish={onFinish} />
  );
};

const SlideCircles = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialAccountCreate.joiningCirclesTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialAccountCreate.joiningCircles')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideWebOfTrust = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialAccountCreate.webOfTrustTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialAccountCreate.webOfTrust')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideUnderConstruction = () => {
  return (
    <Fragment>
      <SpacingStyle>
        <h2>{translate('TutorialAccountCreate.underConstructionTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{translate('TutorialAccountCreate.underConstruction')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

TutorialAccountCreate.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialAccountCreate;
