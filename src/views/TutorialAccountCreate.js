import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Tutorial from '~/components/Tutorial';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';
import { IconSupport, IconNetwork, IconFriendship } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';

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

const SlideCircles = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle>
        <IconSupport isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialAccountCreate.joiningCirclesTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialAccountCreate.joiningCircles')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideWebOfTrust = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle>
        <IconNetwork isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialAccountCreate.webOfTrustTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialAccountCreate.webOfTrust')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

const SlideUnderConstruction = (props, context) => {
  return (
    <Fragment>
      <SpacingStyle>
        <IconFriendship isDark isLarge />
      </SpacingStyle>

      <SpacingStyle>
        <h2>{context.t('TutorialAccountCreate.underConstructionTitle')}</h2>
      </SpacingStyle>

      <SpacingStyle>
        <p>{context.t('TutorialAccountCreate.underConstruction')}</p>
      </SpacingStyle>
    </Fragment>
  );
};

SlideCircles.contextTypes = {
  t: PropTypes.func.isRequired,
};

SlideWebOfTrust.contextTypes = {
  t: PropTypes.func.isRequired,
};

SlideUnderConstruction.contextTypes = {
  t: PropTypes.func.isRequired,
};

TutorialAccountCreate.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialAccountCreate;
