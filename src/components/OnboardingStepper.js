import {
  Box,
  Container,
  IconButton,
  MobileStepper,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    paddingTop: 9,
    paddingRight: 19,
    paddingLeft: 19,
    background: 'transparent',

    '& .MuiMobileStepper-progress': {
      display: 'none',
    },
  },

  onboardingStepperHeader: {
    background: 'transparent',
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
  stepperConfiguration,
  stepsButtons,
  stepsScreens,
  values,
}) => {
  const classes = useStyles();

  const [current, setCurrent] = useState(0);
  const [username, setUsername] = useState('');
  const { filter, query: inputSearch } = useQuery();

  /* eslint-disable react-hooks/exhaustive-deps */
  // Go back to ADD MEMBER screen from details profile
  useEffect(() => {
    if (filter || inputSearch) {
      setCurrent(stepsScreens.ADD_MEMBERS);
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

    if (values.username) {
      setUsername(values.username);
    }
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

  const activeStepForStepperHorizontal = () => {
    if (current <= stepperConfiguration[0].activeTillScreen) {
      return 0;
    } else if (current <= stepperConfiguration[1].activeTillScreen) {
      return 1;
    } else if (current <= stepperConfiguration[2].activeTillScreen) {
      return 2;
    }
  };

  const stepNames = stepperConfiguration.map((step) => step.stepName);
  const CopyToClipboardBtn = stepsButtons[current].additionalBtnSecond;

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
          className={classes.onboardingMobileStepper}
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
      {current >= stepsScreens.ADD_PHOTO && (
        <AvatarHeader
          hideImage={current === stepsScreens.ADD_PHOTO}
          username={username}
        />
      )}
      <View mt={8}>
        <Box className={classes.stepperHorizontalContainer}>
          <StepperHorizontal
            activeStep={activeStepForStepperHorizontal()}
            steps={stepNames}
          />
        </Box>
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
        {stepsButtons[current].additionalBtn && (
          <Box mb={1}>
            <Typography align="center" onClick={onNext}>
              {stepsButtons[current].additionalBtn}
            </Typography>
          </Box>
        )}
        {stepsButtons[current].additionalBtnSecond && <CopyToClipboardBtn />}
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={isLastSlide ? onFinish : onNext}
        >
          {stepsButtons[current].btnNextStep}
        </Button>
      </Footer>
    </Fragment>
  );
};

OnboardingStepper.propTypes = {
  exitPath: PropTypes.string.isRequired,
  onFinish: PropTypes.func.isRequired,
  onValuesChange: PropTypes.func.isRequired,
  stepperConfiguration: PropTypes.array.isRequired,
  steps: PropTypes.array.isRequired,
  stepsButtons: PropTypes.array.isRequired,
  stepsScreens: PropTypes.object,
  values: PropTypes.object.isRequired,
};

export default OnboardingStepper;
