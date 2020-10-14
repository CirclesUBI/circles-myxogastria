import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Box, Container, IconButton, MobileStepper } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import AppNote from '~/components/AppNote';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    padding: 0,
  },
}));

const OnboardingStepper = ({
  exitPath,
  onFinish,
  onValuesChange,
  steps,
  values,
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

  return (
    <Fragment>
      <Header>
        <MobileStepper
          activeStep={current}
          backButton={
            current === 0 ? (
              <ButtonBack />
            ) : (
              <IconButton onClick={onPrevious}>
                <IconBack />
              </IconButton>
            )
          }
          classes={{
            root: classes.onboardingMobileStepper,
          }}
          nextButton={
            <IconButton edge="end" onClick={onExit}>
              <IconClose />
            </IconButton>
          }
          position="static"
          steps={steps.length + 1}
          variant="progress"
        />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box my={6}>
            <Logo />
          </Box>
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
  onFinish: PropTypes.func.isRequired,
  onValuesChange: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
};

export default OnboardingStepper;
