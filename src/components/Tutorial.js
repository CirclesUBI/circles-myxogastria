import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { MobileStepper, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import TutorialSlide from '~/components/TutorialSlide';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  tutorialMobileStepper: {
    flexGrow: 1,
  },
  tutorialMobileStepperDot: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.text.primary}`,
  },
  tutorialMobileStepperDots: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  tutorialMobileStepperDotActive: {
    backgroundColor: theme.palette.text.primary,
  },
  tutorialSkipButton: {
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'uppercase',
    marginRight: -3,
  },
}));

const Slides = ({ slides, current, handleChangeIndex }) => (
  <View>
    <div>
      <SwipeableViews index={current} onChangeIndex={handleChangeIndex}>
        {slides.map((slide) => (
          <TutorialSlide key={slide.title} {...slide} />
        ))}
      </SwipeableViews>
    </div>
  </View>
);

const Tutorial = (props) => {
  const [current, setCurrent] = useState(0);
  const total = props.slides.length;

  const onPrevious = () => {
    setCurrent(current - 1);
  };

  const onNext = () => {
    setCurrent(current + 1);
  };

  const onFinish = () => {
    props.onFinish();
  };

  const handleChangeIndex = (index) => {
    setCurrent(index);
  };

  return (
    <Fragment>
      <TutorialHeader
        current={current}
        total={total}
        onExit={props.onExit}
        onPrevious={onPrevious}
        onSkip={onFinish}
      />
      <Slides
        current={current}
        handleChangeIndex={handleChangeIndex}
        slides={props.slides}
      />
      <TutorialFooter
        current={current}
        total={total}
        onFinish={onFinish}
        onNext={onNext}
      />
    </Fragment>
  );
};

const TutorialHeader = (props) => {
  const classes = useStyles();

  return (
    <Header padding="0">
      <MobileStepper
        activeStep={props.current}
        backButton={
          <IconButton
            edge="start"
            onClick={props.current === 0 ? props.onExit : props.onPrevious}
          >
            {props.current === 0 ? <IconClose /> : <IconBack />}
          </IconButton>
        }
        classes={{
          root: classes.tutorialMobileStepper,
          dots: classes.tutorialMobileStepperDots,
          dot: classes.tutorialMobileStepperDot,
          dotActive: classes.tutorialMobileStepperDotActive,
        }}
        nextButton={
          <Button
            className={classes.tutorialSkipButton}
            isDark
            onClick={props.onSkip}
          >
            {translate('Tutorial.buttonSkip')}
          </Button>
        }
        position="top"
        steps={props.total}
        variant="dots"
      />
    </Header>
  );
};

const TutorialFooter = (props) => {
  const isLastSlide = props.current === props.total - 1;

  return (
    <Footer>
      <Button
        fullWidth
        isPrimary
        onClick={isLastSlide ? props.onFinish : props.onNext}
      >
        {isLastSlide
          ? translate('Tutorial.buttonFinish')
          : translate('Tutorial.buttonNextStep')}
      </Button>
    </Footer>
  );
};

Slides.propTypes = {
  current: PropTypes.number.isRequired,
  handleChangeIndex: PropTypes.func.isRequired,
  slides: PropTypes.array,
};

Tutorial.propTypes = {
  onExit: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  slides: PropTypes.array.isRequired,
};

TutorialHeader.propTypes = {
  current: PropTypes.number.isRequired,
  onExit: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialFooter.propTypes = {
  current: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default Tutorial;
