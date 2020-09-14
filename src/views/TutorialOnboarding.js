import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Box, Typography } from '@material-ui/core';
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
    <SlideUnconditionalIncome key="unconditionalIncome" />,
    <SlideWebOfTrust key="webOfTrust" />,
    <SlideBuildYourOwnEconomy key="buildYourOwnEconomy" />,
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

const SlideUnconditionalIncome = () => {
  return (
    <Fragment>
      <TutorialSlideGraphic>
        <TourUnconditionalIncomeSVG />
      </TutorialSlideGraphic>
      <Typography align="center" gutterBottom variant="h2">
        {translate('TutorialOnboarding.headingUnconditionalIncome')}
      </Typography>
      <Typography>
        {translate('TutorialOnboarding.bodyUnconditionalIncome')}
      </Typography>
    </Fragment>
  );
};

const SlideWebOfTrust = () => {
  return (
    <Fragment>
      <TutorialSlideGraphic>
        <TourWebOfTrustSVG />
      </TutorialSlideGraphic>
      <Typography align="center" gutterBottom variant="h2">
        {translate('TutorialOnboarding.headingWebOfTrust')}
      </Typography>
      <Typography>{translate('TutorialOnboarding.bodyWebOfTrust')}</Typography>
    </Fragment>
  );
};

const SlideBuildYourOwnEconomy = () => {
  return (
    <Fragment>
      <TutorialSlideGraphic>
        <TourBuildYourOwnEconomySVG />
      </TutorialSlideGraphic>
      <Typography align="center" gutterBottom variant="h2">
        {translate('TutorialOnboarding.headingBuildYourOwnEconomy')}
      </Typography>
      <Typography>
        {translate('TutorialOnboarding.bodyBuildYourOwnEconomy')}
      </Typography>
    </Fragment>
  );
};

const TutorialSlideGraphic = ({ children }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      height={200}
      justifyContent="center"
    >
      {children}
    </Box>
  );
};

TutorialOnboarding.propTypes = {
  onExit: PropTypes.func.isRequired,
};

TutorialSlideGraphic.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TutorialOnboarding;
