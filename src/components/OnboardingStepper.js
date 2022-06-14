import { Box, Container, IconButton, MobileStepper } from '@material-ui/core';
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

  stepperHorizontalContainer: {
    marginBottom: '10px',
  },
}));

const OnboardingStepper = ({
  exitPath,
  isOrganization,
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
  console.log('values', values);

  const onDisabledChange = (updatedValue) => {
    console.log('updated value', updatedValue);
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
  const CopyToClipboardBtn = stepsButtons[current].additionalBtn;
  const withHeaderAvatar = current >= stepsScreens.ADD_PHOTO;
  console.log('isDisabled', isDisabled);

  return (
    <Fragment>
      <Header
        hasWhiteIcons
        isOrganization={isOrganization}
        useSpecialWithColorOnScroll={true}
      >
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
      {withHeaderAvatar && (
        <AvatarHeader
          hideImage={current === stepsScreens.ADD_PHOTO}
          username={username}
        />
      )}
      <View mt={withHeaderAvatar ? 0 : 8}>
        <Box
          className={classes.stepperHorizontalContainer}
          mt={withHeaderAvatar ? 0 : '30px'}
        >
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
        {stepsButtons[current].alternativeBtn && (
          <Box mb={1}>
            <Button
              fullWidth
              isOutline
              onClick={isLastSlide ? onFinish : onNext}
            >
              {stepsButtons[current].alternativeBtn}
            </Button>
          </Box>
        )}
        {stepsButtons[current].alternativeBtn && isDisabled && (
          <Box mb={1}>
            <Button
              disabled={isDisabled && !values.avatarUrl}
              fullWidth
              isPrimary
              onClick={isLastSlide ? onFinish : onNext}
            >
              {stepsButtons[current].btnNextStep}
            </Button>
          </Box>
        )}
        {CopyToClipboardBtn && <CopyToClipboardBtn onClick={onFinish} />}
        {/*Show standard next step button if no alternative button exists*/}
        {stepsButtons[current].btnNextStep &&
          !(stepsButtons[current].alternativeBtn && isDisabled) && (
            <Button
              disabled={isDisabled}
              fullWidth
              isPrimary
              onClick={isLastSlide ? onFinish : onNext}
            >
              {stepsButtons[current].btnNextStep}
            </Button>
          )}
      </Footer>
    </Fragment>
  );
};

OnboardingStepper.propTypes = {
  exitPath: PropTypes.string.isRequired,
  isOrganization: PropTypes.bool,
  onFinish: PropTypes.func.isRequired,
  onValuesChange: PropTypes.func.isRequired,
  stepperConfiguration: PropTypes.array.isRequired,
  steps: PropTypes.array.isRequired,
  stepsButtons: PropTypes.array.isRequired,
  stepsScreens: PropTypes.object,
  values: PropTypes.object.isRequired,
};

export default OnboardingStepper;
