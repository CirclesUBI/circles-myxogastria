import React, { Fragment } from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Typography,
  Stepper,
  Step,
  StepConnector,
  StepIcon,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
import translate from '~/services/locale';
import { IconCheck } from '~/styles/icons';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';
import { finalizeNewAccount } from '~/store/onboarding/actions';

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
  const dispatch = useDispatch();
  const { app, safe, trust } = useSelector((state) => state);

  // Attempt deployment if one of two conditions is met:
  //
  // 1. We have enough incoming trust connections, the Relayer will
  // pay for our fees
  // 2. We funded the Safe ourselves manually
  const isReady = safe.pendingIsFunded || trust.isTrusted;

  const onDeploy = async () => {
    await dispatch(finalizeNewAccount());
  };

  // Safe and Token is already deployed or being deployed right now?
  if (app.isValidated || safe.pendingIsLocked) {
    return null;
  }

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
                      [classes.stepAvatarChecked]: isChecked,
                    })}
                  >
                    {isChecked ? <IconCheck /> : index + 1}
                  </Avatar>
                }
              ></StepIcon>
              ;
            </Step>
          );
        })}
      </Stepper>
      {isReady ? (
        <Fragment>
          <Typography align="center" gutterBottom>
            {translate('ValidationStatus.bodyReadyForDeployment')}
          </Typography>
          <Box my={4}>
            <Button fullWidth isPrimary onClick={onDeploy}>
              {translate('ValidationStatus.buttonStartDeployment')}
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Typography align="center">
          {translate('Validation.bodyTrustDescription')}{' '}
          <strong>
            {translate('Validation.bodyTrustDescriptionEmphasize')}
          </strong>
        </Typography>
      )}
    </Fragment>
  );
};

export default ValidationStatus;
