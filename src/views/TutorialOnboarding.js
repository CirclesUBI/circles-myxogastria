import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import TourBuildYourOwnEconomy from '%/images/illustration-own-economy.png';
import TourUnconditionalIncome from '%/images/illustration-unconditional-income.png';
import TourWebOfTrust from '%/images/illustration-web-of-trust.png';
import ExternalLink from '~/components/ExternalLink';
import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { ACCOUNT_CREATE, finishTutorial } from '~/store/tutorial/actions';
import { FAQ_URL } from '~/utils/constants';

const TutorialOnboarding = (props) => {
  const dispatch = useDispatch();

  const slides = [
    {
      image: (
        <img
          src={TourUnconditionalIncome}
          style={{ width: '145px', height: '145px' }}
        />
      ),
      heading: translate('TutorialOnboarding.headingUnconditionalIncome'),
      body: <TutorialOnboardingSlideOne />,
    },
    {
      image: (
        <img src={TourWebOfTrust} style={{ width: '145px', height: '145px' }} />
      ),
      heading: translate('TutorialOnboarding.headingWebOfTrust'),
      body: translate('TutorialOnboarding.bodyWebOfTrust'),
    },
    {
      image: (
        <img
          src={TourBuildYourOwnEconomy}
          style={{ width: '145px', height: '145px' }}
        />
      ),
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
      <ExternalLink href={FAQ_URL}>
        <Typography classes={{ root: 'body3_link_gradient' }} variant="body3">
          {translate('TutorialOnboarding.bodyLearnMore')}
        </Typography>
      </ExternalLink>
    </>
  );
};

TutorialOnboarding.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default TutorialOnboarding;
