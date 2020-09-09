import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Box, Button, MobileStepper } from '@material-ui/core';

import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';

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

  return (
    <Fragment>
      <TutorialHeader
        current={current}
        total={total}
        onExit={props.onExit}
        onPrevious={onPrevious}
        onSkip={onFinish}
      />

      <View>
        <Box>{props.slides[current]}</Box>
      </View>

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
  return (
    <Header>
      <MobileStepper
        activeStep={props.current}
        backButton={
          <Button
            size="small"
            onClick={props.current === 0 ? props.onExit : props.onPrevious}
          >
            Back
          </Button>
        }
        nextButton={
          <Button size="small" onClick={props.onSkip}>
            Skip
          </Button>
        }
        position="static"
        steps={props.total}
        variant="dots"
      />
    </Header>
  );
};

const TutorialFooter = (props) => {
  return (
    <Footer>
      <TutorialFooterButton
        isLastSlide={props.current === props.total - 1}
        onFinish={props.onFinish}
        onNext={props.onNext}
      />
    </Footer>
  );
};

const TutorialFooterButton = (props) => {
  if (props.isLastSlide) {
    return (
      <ButtonPrimary onClick={props.onFinish}>
        {translate('Tutorial.finish')}
      </ButtonPrimary>
    );
  }

  return (
    <ButtonPrimary onClick={props.onNext}>
      {translate('Tutorial.nextStep')}
    </ButtonPrimary>
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

TutorialFooter.propTypes = {
  current: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialFooterButton.propTypes = {
  isLastSlide: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Tutorial;
