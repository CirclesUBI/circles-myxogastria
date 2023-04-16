import { Box } from '@mui/material';
import { Step } from '@mui/material';
import { StepButton as StepperButton } from '@mui/material';
import { Stepper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import {
  fontSizeSmaller,
  fontSizeSmallest,
  fontWeightRegular,
} from '~/styles/fonts';

const useStyles = makeStyles((theme) => {
  const colorTheme = (isOrganization) =>
    isOrganization
      ? theme.custom.colors.purple100
      : theme.custom.colors.blue100;
  return {
    stepper: {
      padding: '24px',
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
      },
      '& .Mui-completed': {
        '& .MuiStepConnector-horizontal.MuiStepConnector-root': {
          '& .MuiStepConnector-line': {
            background: colorTheme,
            border: '1.5px solid transparent',
          },
        },
      },

      '& .MuiStep-alternativeLabel': {
        '& .Mui-active': {
          '& .MuiStepConnector-line': {
            background: colorTheme,
            border: '1.5px solid transparent',
          },
        },
      },
    },
    stepperButton: {
      '& .MuiSvgIcon-root.MuiStepIcon-root': {
        color: '#fff',
        fontWeight: '500',
        fontSize: '1.3rem',
        borderRadius: '100%',
        border: `2px solid ${theme.custom.colors.grayDark}`,
        [theme.breakpoints.up('md')]: {
          fontSize: '1.8rem',
        },
        '& .MuiStepIcon-text': {
          fill: theme.custom.colors.grayDark,
        },

        '&.Mui-completed, &.Mui-active': {
          background: colorTheme,
          border: '2px solid transparent',

          '& .MuiStepIcon-text': {
            fill: colorTheme,
          },
        },
      },

      '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
        fontSize: fontSizeSmallest,
        fontWeight: fontWeightRegular,
        color: theme.custom.colors.grayDark,
        marginTop: '8px',
        [theme.breakpoints.up('md')]: {
          fontSize: fontSizeSmaller,
        },
      },

      '& .Mui-completed.MuiStepLabel-label ,& .MuiStepLabel-label.Mui-active': {
        color: colorTheme,
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
