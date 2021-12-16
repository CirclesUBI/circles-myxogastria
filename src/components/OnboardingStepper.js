import { Box, Container, IconButton, MobileStepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';

import AppNote from '~/components/AppNote';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import StepperHorizontal from '~/components/StepperHorizontal';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    paddingTop: 9,
    paddingRight: 19,
    paddingLeft: 19,
  },

  hideProgressBar: {
    '& .MuiMobileStepper-progress': {
      display: 'none',
    },
  },
}));

const OnboardingStepper = ({
  exitPath,
  onFinish,
  onValuesChange,
  steps,
  values,
  isHorizontalStepper,
}) => {
  const classes = useStyles();

  const [current, setCurrent] = useState(0);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const onChange = (updatedValues) => {
    onValuesChange({
      ...values,
      ...updatedValues,
    });
  };

  const onDisabledChange = (updatedValue) => {
    setIsDisabled(updatedValue);
  };

  const onNext = () => {
    setCurrent(current + 1);
    setIsDisabled(true);
  };

  const onPrevious = () => {
    setCurrent(current - 1);
  };

  const onExit = () => {
    setIsRedirect(true);
  };

  const OnboardingCurrentStep = steps[current];
  const isLastSlide = current === steps.length - 1;

  if (isRedirect) {
    return <Redirect push to={exitPath} />;
  }

  const stepsStepperHorizontal = [
    translate('OnboardingOrganization.stepperFirstStep'),
    translate('OnboardingOrganization.stepperSecondStep'),
    translate('OnboardingOrganization.stepperThirdStep'),
  ];

  const activeStepForStepperHorizontal = () => {
    switch (current) {
      case 0:
        return 0;
      case 1:
      case 2:
        return 1;
      case 3:
        return 2;
    }
  };

  return (
    <Fragment>
      <Header>
        <MobileStepper
          activeStep={current}
          backButton={
            current === 0 ? (
              <ButtonBack edge="start" />
            ) : (
              <IconButton edge="start" onClick={onPrevious}>
                <IconBack />
              </IconButton>
            )
          }
          className={
            (classes.onboardingMobileStepper,
            isHorizontalStepper ? classes.hideProgressBar : null)
          }
          nextButton={
            <IconButton edge="end" onClick={onExit}>
              <IconClose />
            </IconButton>
          }
          position="top"
          steps={steps.length + 1}
          variant="progress"
        />
      </Header>
      <View>
        {isHorizontalStepper && (
          <Box>
            <StepperHorizontal
              activeStep={activeStepForStepperHorizontal()}
              steps={stepsStepperHorizontal}
            />
          </Box>
        )}
        <Container maxWidth="sm">
          <Box textAlign="center">
            <OnboardingCurrentStep
              values={values}
              onChange={onChange}
              onDisabledChange={onDisabledChange}
            />
          </Box>
        </Container>
      </View>
      <Footer>
        <AppNote />
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={isLastSlide ? onFinish : onNext}
        >
          {isLastSlide
            ? translate('OnboardingStepper.buttonFinish')
            : translate('OnboardingStepper.buttonNextStep')}
        </Button>
      </Footer>
    </Fragment>
  );
};

OnboardingStepper.propTypes = {
  exitPath: PropTypes.string.isRequired,
  isHorizontalStepper: PropTypes.bool,
  onFinish: PropTypes.func.isRequired,
  onValuesChange: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};

export default OnboardingStepper;
