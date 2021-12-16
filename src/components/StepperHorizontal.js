import { Box } from '@material-ui/core';
import { Step } from '@material-ui/core';
import { StepButton } from '@material-ui/core';
import { Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const gradient =
  'linear-gradient(#48B2B7, #06FC9D) padding-box, linear-gradient(to bottom, #48B2B7, #06FC9D) border-box';

const useStyles = makeStyles(() => ({
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
          background: gradient,
          border: '2px solid transparent',
        },
      },
    },
  },
  stepperBtn: {
    '& .MuiSvgIcon-root.MuiStepIcon-root': {
      color: '#fff',
      fontWeight: '600',
      fontSize: '1.3rem',
      borderRadius: '100%',
      border: '2px solid #999999',

      '& .MuiStepIcon-text': {
        fill: '#999999',
      },

      '&.MuiStepIcon-active, &.MuiStepIcon-completed': {
        background: gradient,
        border: '2px solid transparent',

        '& .MuiStepIcon-text': {
          fill: '##48B2B7',
        },
      },
    },

    '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
      fontSize: '10px',
      color: '#999999',

      '&.MuiStepLabel-completed, &.MuiStepLabel-active': {
        backgroundImage: 'linear-gradient(180deg, #48B2B7, #06FC9D)',
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
            <StepButton className={classes.stepperBtn}>{label}</StepButton>
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
