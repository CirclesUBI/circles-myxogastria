import {
  Avatar,
  Step,
  StepConnector,
  StepIcon,
  Stepper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { IconCheck } from '~/styles/icons';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  stepper: {
    maxWidth: theme.spacing(40),
    margin: '0 auto',
  },
  connectorLine: {
    borderColor: theme.palette.secondary.main,
    borderTopWidth: '2px',
  },
  step: {
    padding: 0,
  },
  stepAvatar: {
    background: 'transparent',
    border: `2px solid ${theme.palette.secondary.main}`,
    color: theme.palette.secondary.main,
  },
  stepAvatarChecked: {
    background: theme.custom.gradients.turquoise,
    border: 0,
    color: theme.palette.common.white,
  },
}));

const ValidationStatus = () => {
  const classes = useStyles();
  const { safe, trust } = useSelector((state) => state);

  // Attempt deployment if one of two conditions is met:
  //
  // 1. We have enough incoming trust connections, the Relayer will
  // pay for our fees
  // 2. We funded the Safe ourselves manually
  const isReady = safe.pendingIsFunded || trust.isTrusted;

  return (
    <Fragment>
      <Stepper
        activeStep={trust.connections}
        className={classes.stepper}
        connector={<StepConnector classes={{ line: classes.connectorLine }} />}
      >
        {new Array(NEEDED_TRUST_CONNECTIONS).fill({}).map((item, index) => {
          const isChecked = index <= trust.connections - 1;
          return (
            <Step className={classes.step} key={index}>
              <StepIcon
                icon={
                  <Avatar
                    className={clsx(classes.stepAvatar, {
                      [classes.stepAvatarChecked]: isChecked || isReady,
                    })}
                  >
                    {isChecked || isReady ? <IconCheck /> : index + 1}
                  </Avatar>
                }
              ></StepIcon>
              ;
            </Step>
          );
        })}
      </Stepper>
    </Fragment>
  );
};

export default ValidationStatus;
