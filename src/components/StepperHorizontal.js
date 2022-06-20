import { Box } from '@material-ui/core';
import { Step } from '@material-ui/core';
import { StepButton as StepperButton } from '@material-ui/core';
import { Stepper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => {
  const colorTheme = (isOrganization) =>
    isOrganization
      ? theme.custom.colors.violet
      : theme.custom.colors.fountainBlue;
  return {
    stepper: {
      '& .MuiStepConnector-horizontal': {
        left: 'calc(-50% + 12px)',
        right: 'calc(50% + 12px)',
        top: '11px',
        [theme.breakpoints.up('md')]: {
          top: '15px',
          left: 'calc(-50% + 16px)',
          right: 'calc(50% + 16px)',
        },

        '& .MuiStepConnector-lineHorizontal': {
          borderTopWidth: '2.5px',
          [theme.breakpoints.up('md')]: {
            borderTopWidth: '3px',
          },
        },

        '&.MuiStepConnector-active, &.MuiStepConnector-completed': {
          '& .MuiStepConnector-lineHorizontal': {
            background: colorTheme,
            border: '1.5px solid transparent',
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
        [theme.breakpoints.up('md')]: {
          fontSize: '1.8rem',
        },

        '& .MuiStepIcon-text': {
          fill: theme.custom.colors.grayDark,
        },

        '&.MuiStepIcon-active, &.MuiStepIcon-completed': {
          background: (isOrganization) =>
            isOrganization
              ? theme.custom.colors.violet
              : theme.custom.colors.fountainBlue,
          border: '2px solid transparent',

          '& .MuiStepIcon-text': {
            fill: colorTheme,
          },
        },
      },

      '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
        fontSize: '10px',
        fontWeight: '500',
        color: theme.custom.colors.grayDark,
        marginTop: '8px',
        [theme.breakpoints.up('md')]: {
          fontSize: '12px',
        },

        '&.MuiStepLabel-completed, &.MuiStepLabel-active': {
          color: colorTheme,
        },
      },
    },
  };
});

const StepperHorizontal = ({ steps, activeStep, isOrganization }) => {
  const classes = useStyles(isOrganization);

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
  isOrganization: PropTypes.bool,
  steps: PropTypes.array.isRequired,
};

export default StepperHorizontal;
