import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Box,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import AvatarUploader from '~/components/AvatarUploader';
import OnboardingStepper from '~/components/OnboardingStepper';
import TransferInfoBalanceCard from '~/components/TransferInfoBalanceCard';
import TransferCirclesInput from '~/components/TransferCirclesInput';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { DASHBOARD_PATH } from '~/routes';
import { createNewOrganization } from '~/store/onboarding/actions';
import { formatCirclesValue } from '~/utils/format';
import { validateAmount } from '~/services/token';

const useStyles = makeStyles(() => ({
  switchLabel: {
    fontSize: 12,
    textAlign: 'left',
  },
}));

const OnboardingOrganization = () => {
  const dispatch = useDispatch();
  const [isRedirect, setIsRedirect] = useState(false);

  const [values, setValues] = useState({
    avatarUrl: '',
    email: '',
    username: '',
    prefundValue: 0,
  });

  const onFinish = async () => {
    try {
      await dispatch(
        createNewOrganization(values.username, values.email, values.avatarUrl),
      );

      dispatch(
        notify({
          text: translate('OnboardingOrganization.successOnboardingComplete'),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      setIsRedirect(true);
    } catch (error) {
      logError(error);

      const errorMessage = formatErrorMessage(error);

      dispatch(
        notify({
          text: translate('OnboardingOrganization.errorSignup', {
            errorMessage,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  const steps = [
    OrganizationStepUsername,
    OrganizationStepEmail,
    OrganizationStepAvatar,
    OrganizationStepConsent,
    OrganizationStepPrefund,
  ];

  if (isRedirect) {
    return <Redirect push to={DASHBOARD_PATH} />;
  }

  return (
    <OnboardingStepper
      exitPath={DASHBOARD_PATH}
      steps={steps}
      values={values}
      onFinish={onFinish}
      onValuesChange={setValues}
    />
  );
};

const OrganizationStepUsername = ({ onDisabledChange, values, onChange }) => {
  const handleChange = (username) => {
    onChange({
      username,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingUsername')}
      </Typography>
      <Typography>
        {translate('OnboardingOrganization.bodyUsername')}
      </Typography>
      <Box mt={4}>
        <VerifiedUsernameInput
          label={translate('OnboardingOrganization.formUsername')}
          value={values.username}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
    </Fragment>
  );
};

const OrganizationStepEmail = ({ values, onDisabledChange, onChange }) => {
  const handleChange = (email) => {
    onChange({
      email,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingEmail')}
      </Typography>
      <Typography>{translate('OnboardingOrganization.bodyEmail')}</Typography>
      <Box mt={4}>
        <VerifiedEmailInput
          label={translate('OnboardingOrganization.formEmail')}
          value={values.email}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
    </Fragment>
  );
};

const OrganizationStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingAvatar')}
      </Typography>
      <Typography>{translate('OnboardingOrganization.bodyAvatar')}</Typography>
      <Box mt={4}>
        <AvatarUploader
          value={values.avatarUrl}
          onLoadingChange={onDisabledChange}
          onUpload={handleUpload}
        />
      </Box>
    </Fragment>
  );
};

const OrganizationStepConsent = ({ onDisabledChange }) => {
  const classes = useStyles();
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    onDisabledChange(!isChecked);
  }, [onDisabledChange, isChecked]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingConsent')}
      </Typography>
      <Typography>{translate('OnboardingOrganization.bodyConsent')}</Typography>
      <Box my={4}>
        <FormControlLabel
          classes={{ label: classes.switchLabel }}
          control={
            <Switch
              checked={isChecked}
              color="primary"
              onChange={handleChange}
            />
          }
          label={translate('OnboardingOrganization.formConsentSwitch')}
        />
      </Box>
    </Fragment>
  );
};

const OrganizationStepPrefund = ({ onDisabledChange, values, onChange }) => {
  const [isError, setIsError] = useState(false);
  const { safe, token } = useSelector((state) => state);

  const maxAmount = parseFloat(
    formatCirclesValue(web3.utils.toBN(token.balance)),
  );

  const handleChange = (event) => {
    const prefundValue = event.target.value;
    const isValid = validateAmount(prefundValue);
    const isAmountTooHigh =
      (prefundValue ? parseFloat(prefundValue) : 0) > maxAmount;

    setIsError(prefundValue > 0 ? !isValid || isAmountTooHigh : false);

    onChange({
      prefundValue,
    });
  };

  useEffect(() => {
    onDisabledChange(
      isError || !values.prefundValue || values.prefundValue === 0,
    );
  }, [onDisabledChange, isError, values.prefundValue]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingPrefund')}
      </Typography>
      <Typography>{translate('OnboardingOrganization.bodyPrefund')}</Typography>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TransferInfoBalanceCard
              address={safe.currentAccount}
              balance={token.balance}
              label={translate('OnboardingOrganization.formPrefundSender')}
            />
          </Grid>
          <Grid item xs={12}>
            <TransferCirclesInput
              autoFocus
              errorMessage={translate(
                'OnboardingOrganization.formPrefundInvalid',
              )}
              id="prefundValue"
              isError={isError}
              label={translate('OnboardingOrganization.formPrefundAmount')}
              value={values.prefundValue}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

const stepProps = {
  onChange: PropTypes.func.isRequired,
  onDisabledChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

OrganizationStepUsername.propTypes = {
  ...stepProps,
};

OrganizationStepEmail.propTypes = {
  ...stepProps,
};

OrganizationStepAvatar.propTypes = {
  ...stepProps,
};

OrganizationStepConsent.propTypes = {
  ...stepProps,
};

OrganizationStepPrefund.propTypes = {
  ...stepProps,
};

export default OnboardingOrganization;
