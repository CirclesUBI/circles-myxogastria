import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import TransitionHeartSVG from '%/images/transition-heart.svg';
import TransitionPhoneSVG from '%/images/transition-phone.svg';
import TransitionQuestionSVG from '%/images/transition-question-mark.svg';
import ExternalLink from '~/components/ExternalLink';
import Tutorial from '~/components/Tutorial';
import translate from '~/services/locale';
import { TRANSITION_ARTICE_URL } from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    textAlign: 'left',
    listStyle: 'none',

    '& > li': {
      position: 'relative',

      '&::before': {
        content: '""',
        width: '3px',
        height: '3px',
        borderRadius: '5px',
        background: theme.custom.colors.grayDarkest,
        position: 'absolute',
        left: '-15px',
        top: '10px',
      },
    },
  },
  link: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const TutorialTransition = (props) => {
  const slides = [
    {
      image: <TransitionHeartSVG />,
      heading: translate('TutorialTransition.slideHeading1'),
      body: <TutorialTransitionSlideOne />,
    },
    {
      image: <TransitionQuestionSVG />,
      heading: translate('TutorialTransition.slideHeading2'),
      body: <TutorialTransitionSlideTwo />,
    },
    {
      image: <TransitionPhoneSVG />,
      heading: translate('TutorialTransition.slideHeading3'),
      body: <TutorialTransitionSlideThree />,
    },
  ];

  const onExit = () => {
    props.onExit();
  };

  const onFinish = () => {
    props.onFinish();
  };

  return (
    <Tutorial
      finishBtnText={translate('Tutorial.buttonFinish2')}
      slides={slides}
      onExit={onExit}
      onFinish={onFinish}
    />
  );
};

const TutorialTransitionSlideOne = () => {
  return (
    <>
      <p>{translate('TutorialTransition.slideBody11')}</p>
      <p>{translate('TutorialTransition.slideBody12')}</p>
    </>
  );
};
const TutorialTransitionSlideTwo = () => {
  const classes = useStyles();

  return (
    <>
      <p>{translate('TutorialTransition.slideBody21')}</p>
      <p>{translate('TutorialTransition.slideBody22')}</p>
      <ExternalLink className={classes.link} href={TRANSITION_ARTICE_URL}>
        {translate('TutorialTransition.slideBodyLink')}
      </ExternalLink>
    </>
  );
};
const TutorialTransitionSlideThree = () => {
  const classes = useStyles();

  return (
    <>
      <p>{translate('TutorialTransition.slideBody31')}</p>
      <ul className={classes.listContainer}>
        <li data={5}>{translate('TutorialTransition.slideBody3ListItem')}</li>
        <li>{translate('TutorialTransition.slideBody3ListItem2')}</li>
        <li data={5}>{translate('TutorialTransition.slideBody3ListItem3')}</li>
        <li data={5}>{translate('TutorialTransition.slideBody3ListItem4')}</li>
        <li data={5}>{translate('TutorialTransition.slideBody3ListItem5')}</li>
      </ul>
    </>
  );
};

TutorialTransition.propTypes = {
  onExit: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};

export default TutorialTransition;
