import { Box } from '@material-ui/core';
import { Step } from '@material-ui/core';
import { StepButton as StepperButton } from '@material-ui/core';
import { Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  stepper: {
    '& .MuiStepConnector-horizontal': {
      left: 'calc(-50% + 10px)',
      right: 'calc(50% + 10px)',
      top: '10px',

      '& .MuiStepConnector-lineHorizontal': {
        borderTopWidth: '3px',
      },

      '&.MuiStepConnector-active, &.MuiStepConnector-completed': {
        '& .MuiStepConnector-lineHorizontal': {
          background: theme.custom.gradients.blueGreen,
          border: '2px solid transparent',
        },
      },
    },
  },
  stepperButton: {
    '& .MuiSvgIcon-root.MuiStepIcon-root': {
      color: '#fff',
      fontWeight: '600',
      fontSize: '1.3rem',
      borderRadius: '100%',
      border: `2px solid ${theme.custom.colors.grayDark}`,

      '& .MuiStepIcon-text': {
        fill: theme.custom.colors.grayDark,
      },

      '&.MuiStepIcon-active, &.MuiStepIcon-completed': {
        background: theme.custom.gradients.blueGreen,
        border: '2px solid transparent',

        '& .MuiStepIcon-text': {
          fill: theme.custom.colors.fountainBlue,
        },
      },
    },

    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
      fontSize: '10px',
      color: theme.custom.colors.grayDark,

      '&.MuiStepLabel-completed, &.MuiStepLabel-active': {
        backgroundImage: theme.custom.gradients.greenBlue,
        backgroundClip: 'text',
        ['-webkit-background-clip']: 'text',
        color: 'transparent',
      },
    },
  },
}));

const StepperHorizontal = ({ steps, activeStep }) => {
  const classes = useStyles();

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepperButton className={classes.stepperButton}>
              {label}
            </StepperButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

StepperHorizontal.propTypes = {
  activeStep: PropTypes.number,
  steps: PropTypes.array.isRequired,
};

export default StepperHorizontal;
