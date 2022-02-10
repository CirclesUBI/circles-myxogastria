import {
  Box,
  Container,
  IconButton,
  MobileStepper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import AppNote from '~/components/AppNote';
import AvatarHeader from '~/components/AvatarHeader';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import StepperHorizontal from '~/components/StepperHorizontal';
import View from '~/components/View';
import { useQuery } from '~/hooks/url';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    paddingTop: 9,
    paddingRight: 19,
    paddingLeft: 19,
    background: 'transparent',
  },

  onboardingStepperHeader: {
    background: 'transparent',
  },

  hideProgressBar: {
    '& .MuiMobileStepper-progress': {
      display: 'none',
    },
  },

  stepperHorizontalContainer: {
    marginBottom: '10px',
    marginTop: '30px',
  },
}));

const OnboardingStepper = ({
  exitPath,
  onFinish,
  onValuesChange,
  steps,
  values,
  isHorizontalStepper,
  todoRemoveFlag,
}) => {
  const classes = useStyles();

  const [current, setCurrent] = useState(0);
  const { filter, query: inputSearch } = useQuery();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (filter || inputSearch) {
      setCurrent(screenNames.ADD_MEMBERS);
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

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
    // TODO: temporary if to be able to move to next step
    if (current + 1 === screenNames.ADD_MEMBERS) {
      return;
    }
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
  const isAddPhotoSlide = current === 3;

  if (isRedirect) {
    return <Redirect push to={exitPath} />;
  }

  const stepsStepperHorizontal = [
    translate('OnboardingOrganization.stepperFirstStep'),
    translate('OnboardingOrganization.stepperSecondStep'),
    translate('OnboardingOrganization.stepperThirdStep'),
  ];

  const screenNames = {
    ENTER_EMAIL: 0,
    FUND_YOUR_ORGANIZATION: 1,
    CREATE_YOUR_USERNAME: 2,
    ADD_PHOTO: 3,
    ADD_MEMBERS: 4,
  };
  const stepperSteps = {
    CREATE_WALLET: 0,
    MAKE_PROFILE: 1,
    ADD_MEMBERS: 2,
  };

  const activeStepForStepperHorizontal = () => {
    // we have more screens/views than steps in our stepper thus that we need to adapt
    switch (current) {
      case screenNames.ENTER_EMAIL:
        return stepperSteps.CREATE_WALLET;
      case screenNames.FUND_YOUR_ORGANIZATION:
      case screenNames.CREATE_YOUR_USERNAME:
        return stepperSteps.MAKE_PROFILE;
      case screenNames.ADD_PHOTO:
        return stepperSteps.ADD_MEMBERS;
      case screenNames.ADD_MEMBERS:
        return stepperSteps.ADD_MEMBERS;
    }
  };

  const btnTranslateTextForNextStep = () => {
    switch (current) {
      case screenNames.ENTER_EMAIL:
        return translate('OnboardingStepper.buttonSubmit');
      case screenNames.FUND_YOUR_ORGANIZATION:
        return translate('OnboardingStepper.buttonFinish');
      case screenNames.CREATE_YOUR_USERNAME:
      case screenNames.ADD_PHOTO:
        return translate('OnboardingStepper.buttonSubmit');
      case screenNames.ADD_MEMBERS:
        return translate('OnboardingStepper.skipStep');
    }
  };

  return (
    <Fragment>
      <Header className={classes.onboardingStepperHeader}>
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
          className={clsx(classes.onboardingMobileStepper, {
            [classes.hideProgressBar]: isHorizontalStepper,
          })}
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
      {todoRemoveFlag && current >= screenNames.ADD_PHOTO && (
        <AvatarHeader hideImage={current == screenNames.ADD_PHOTO} />
      )}
      <View mt={8}>
        {isHorizontalStepper && (
          <Box className={classes.stepperHorizontalContainer}>
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
        {isAddPhotoSlide ? (
          <Box mb={1}>
            <Typography align="center" onClick={onNext}>
              {translate('OnboardingOrganization.skipStep')}
            </Typography>
          </Box>
        ) : null}
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={isLastSlide ? onFinish : onNext}
        >
          {btnTranslateTextForNextStep()}
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
  todoRemoveFlag: PropTypes.bool,
  values: PropTypes.object.isRequired,
};

export default OnboardingStepper;
