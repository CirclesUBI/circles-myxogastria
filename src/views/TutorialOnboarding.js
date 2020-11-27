import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import TourBuildYourOwnEconomySVG from '%/images/tour-build-your-own-economy.svg';
import TourUnconditionalIncomeSVG from '%/images/tour-unconditional-income.svg';
import TourWebOfTrustSVG from '%/images/tour-web-of-trust.svg';
import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';

const TutorialOnboarding = (props) => {
  const dispatch = useDispatch();

  const slides = [
    {
      image: <TourUnconditionalIncomeSVG />,
      heading: translate('TutorialOnboarding.headingUnconditionalIncome'),
      body: translate('TutorialOnboarding.bodyUnconditionalIncome'),
    },
    {
      image: <TourWebOfTrustSVG />,
      heading: translate('TutorialOnboarding.headingWebOfTrust'),
      body: translate('TutorialOnboarding.bodyWebOfTrust'),
    },
    {
      image: <TourBuildYourOwnEconomySVG />,
      heading: translate('TutorialOnboarding.headingBuildYourOwnEconomy'),
      body: translate('TutorialOnboarding.bodyBuildYourOwnEconomy'),
    },
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

TutorialOnboarding.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialOnboarding;
