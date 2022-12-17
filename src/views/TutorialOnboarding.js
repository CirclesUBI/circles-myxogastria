import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import TourBuildYourOwnEconomySVG from '%/images/build-your-own-economy.svg';
import TourUnconditionalIncomeSVG from '%/images/unconditional-income.svg';
import TourWebOfTrustSVG from '%/images/web-of-trust.svg';
// import TourBuildYourOwnEconomySVG from '%/images/tour-build-your-own-economy.svg';
// import TourUnconditionalIncomeSVG from '%/images/tour-unconditional-income.svg';
// import TourWebOfTrustSVG from '%/images/tour-web-of-trust.svg';
import ExternalLink from '~/components/ExternalLink';
import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';
import { FAQ_URL } from '~/utils/constants';

const TutorialOnboarding = (props) => {
  const dispatch = useDispatch();

  const slides = [
    {
      image: <TourUnconditionalIncomeSVG />,
      heading: translate('TutorialOnboarding.headingUnconditionalIncome'),
      body: <TutorialOnboardingSlideOne />,
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
    <Tutorial
      finishBtnText={translate('Tutorial.buttonFinish')}
      isPreviousBtn
      isSkippable
      slides={slides}
      onExit={onExit}
      onFinish={onFinish}
    />
  );
};

const TutorialOnboardingSlideOne = () => {
  return (
    <>
      {translate('TutorialOnboarding.bodyUnconditionalIncome')}{' '}
      <ExternalLink href={FAQ_URL} underline="always">
        {translate('TutorialOnboarding.bodyLearnMore')}
      </ExternalLink>
    </>
  );
};

TutorialOnboarding.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialOnboarding;
