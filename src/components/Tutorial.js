import { IconButton, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import BackgroundCurved from '~/components/BackgroundCurved';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import TutorialSlide from '~/components/TutorialSlide';
import View from '~/components/View';
import { useCustomScrollTrigger } from '~/hooks/scrollTrigger';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  tutorialMobileStepper: {
    flexGrow: 1,
    background: 'transparent',
  },
  tutorialMobileStepperDot: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.common.white}`,
  },
  tutorialMobileStepperDots: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  tutorialMobileStepperDotActive: {
    backgroundColor: theme.palette.text.primary,
    border: `1px solid ${theme.palette.text.primary}`,
  },
  tutorialSkipButton: {
    fontWeight: theme.typography.fontWeightMedium,
    textTransform: 'uppercase',
    marginRight: -3,
  },
  tutorialHeader: {
    background: 'transparent',
  },
  tutorialHeaderWithScroll: {
    background: theme.palette.common.white,
    transition: theme.transitions.create(['background'], {
      duration: '300ms',
    }),
  },
}));

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
      <TutorialSlides
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

  const isScrolled = useCustomScrollTrigger();

  return (
    <Header
      className={clsx(classes.tutorialHeader, {
        [classes.tutorialHeaderWithScroll]: isScrolled,
      })}
      padding="0"
    >
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

const TutorialSlides = ({ slides, current, handleChangeIndex }) => (
  <BackgroundCurved>
    <View>
      <div>
        <SwipeableViews index={current} onChangeIndex={handleChangeIndex}>
          {slides.map((slide, index) => (
            <TutorialSlide {...slide} key={index} />
          ))}
        </SwipeableViews>
      </div>
    </View>
  </BackgroundCurved>
);

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

TutorialSlides.propTypes = {
  current: PropTypes.number.isRequired,
  handleChangeIndex: PropTypes.func.isRequired,
  slides: PropTypes.array,
};

TutorialFooter.propTypes = {
  current: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default Tutorial;
