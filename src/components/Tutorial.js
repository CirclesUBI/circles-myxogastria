import { IconButton, MobileStepper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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
    backgroundColor: theme.palette.icons.light,
    border: `1px solid ${theme.palette.icons.light}`,
  },
  tutorialMobileStepperDots: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  tutorialMobileStepperDotActive: {
    background: theme.palette.icons.dark,
    border: `2px solid ${theme.palette.icons.dark}`,
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
        isPreviousBtn={props.isPreviousBtn}
        isSkippable={props.isSkippable}
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
        finishBtnText={props.finishBtnText}
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

  const backbuttonClickHandler = () => {
    if (props.current === 0) {
      props.onExit();
    } else if (props.isPreviousBtn) {
      props.onPrevious();
    } else {
      props.onExit();
    }
  };

  return (
    <Header
      className={clsx(classes.tutorialHeader, {
        [classes.tutorialHeaderWithScroll]: isScrolled,
      })}
      hasWhiteIcons
      padding="0"
      useSpecialWithColorOnScroll={true}
    >
      <MobileStepper
        activeStep={props.current}
        backButton={
          <IconButton
            edge="start"
            size="large"
            onClick={backbuttonClickHandler}
          >
            <TutorialHeaderBackButton
              current={props.current}
              isPreviousBtn={props.isPreviousBtn}
            />
          </IconButton>
        }
        classes={{
          root: classes.tutorialMobileStepper,
          dots: classes.tutorialMobileStepperDots,
          dot: classes.tutorialMobileStepperDot,
          dotActive: classes.tutorialMobileStepperDotActive,
        }}
        nextButton={
          props.isSkippable ? (
            <Button
              className={classes.tutorialSkipButton}
              isWhiteText
              onClick={props.onSkip}
            >
              {translate('Tutorial.buttonSkip')}
            </Button>
          ) : null
        }
        position="top"
        steps={props.total}
        variant="dots"
      />
    </Header>
  );
};

const TutorialHeaderBackButton = ({ current, isPreviousBtn }) =>
  current === 0 ? <IconClose /> : isPreviousBtn ? <IconBack /> : <IconClose />;

const TutorialSlides = ({ slides, current, handleChangeIndex }) => (
  <BackgroundCurved gradient="turquoise">
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
      <Button fullWidth onClick={isLastSlide ? props.onFinish : props.onNext}>
        {isLastSlide
          ? props.finishBtnText
          : translate('Tutorial.buttonNextStep')}
      </Button>
    </Footer>
  );
};

Tutorial.propTypes = {
  finishBtnText: PropTypes.string.isRequired,
  isPreviousBtn: PropTypes.bool,
  isSkippable: PropTypes.bool,
  onExit: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  slides: PropTypes.array.isRequired,
};

TutorialHeader.propTypes = {
  current: PropTypes.number.isRequired,
  isPreviousBtn: PropTypes.bool,
  isSkippable: PropTypes.bool,
  onExit: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialHeaderBackButton.propTypes = {
  current: PropTypes.number.isRequired,
  isPreviousBtn: PropTypes.bool,
};

TutorialSlides.propTypes = {
  current: PropTypes.number.isRequired,
  handleChangeIndex: PropTypes.func.isRequired,
  slides: PropTypes.array,
};

TutorialFooter.propTypes = {
  current: PropTypes.number.isRequired,
  finishBtnText: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default Tutorial;
