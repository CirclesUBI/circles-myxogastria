import { Box, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ethers } from 'ethers';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath } from 'react-router';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH, ORGANIZATION_PATH, PROFILE_PATH } from '~/routes';

import AvatarUploader from '~/components/AvatarUploader';
import BackgroundCurved from '~/components/BackgroundCurved';
import CheckboxPrivacy from '~/components/CheckboxPrivacy';
import CheckboxTerms from '~/components/CheckboxTerms';
import Finder from '~/components/Finder';
import OnboardingStepper from '~/components/OnboardingStepper';
import TransferCirclesInput from '~/components/TransferCirclesInput';
import TransferInfoBalanceCard from '~/components/TransferInfoBalanceCard';
import TutorialOrganization from '~/components/TutorialOrganization';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import { validateAmount } from '~/services/token';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { createNewOrganization } from '~/store/onboarding/actions';
import { checkCurrentBalance } from '~/store/token/actions';
import {
  ORGANIZATION_TUTORIAL,
  finishTutorial,
} from '~/store/tutorial/actions';
import logError, { formatErrorMessage } from '~/utils/debug';
import { formatCirclesValue } from '~/utils/format';

const moveUpFront = (theme) => ({
  position: 'relative',
  zIndex: theme.zIndex.layer1,
});
const useStyles = makeStyles((theme) => ({
  organizationStepAddMembersContainer: moveUpFront(theme),
  organizationStepWalletNameContainer: moveUpFront(theme),
  organizationEmailContainer: moveUpFront(theme),
  organizationStepAvatarContainer: moveUpFront(theme),
  organizationStepPrefundContainer: moveUpFront(theme),
  CheckboxesContainer: {
    '& a': {
      color: theme.custom.colors.blueRibbon,
    },
  },
}));

const OnboardingOrganization = () => {
  const dispatch = useDispatch();
  const [isRedirect, setIsRedirect] = useState(false);
  const { isFinished: isTutorialFinished } = useSelector((state) => {
    return state.tutorial[ORGANIZATION_TUTORIAL];
  });

  const [values, setValues] = useState({
    avatarUrl: '',
    email: '',
    username: '',
    prefundValue: 0,
  });

  // Update available token balance for prefund step. This is required
  // especially for the case when we land on this page directly, not having
  // that data yet.
  useUpdateLoop(async () => {
    await dispatch(checkCurrentBalance());
  });

  const onFinish = async () => {
    try {
      await dispatch(
        createNewOrganization(
          values.username,
          values.email,
          values.avatarUrl,
          values.prefundValue,
        ),
      );

      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('OnboardingOrganization.successOnboardingComplete')}
            </Typography>
          ),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      setIsRedirect(true);
    } catch (error) {
      logError(error);

      const errorMessage = formatErrorMessage(error);

      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('OnboardingOrganization.errorSignup', {
                errorMessage,
              })}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  const steps = [
    OrganizationStepEmail,
    OrganizationStepPrefund,
    OrganizationStepWalletName,
    OrganizationStepAvatar,
  ];

  const stepsScreens = {
    ENTER_EMAIL: 0,
    FUND_YOUR_ORGANIZATION: 1,
    NAME_YOUR_WALLET: 2,
    ADD_PHOTO: 3,
  };

  const stepperConfiguration = [
    {
      stepName: translate('OnboardingOrganization.stepperFirstStep'),
      activeTillScreen: stepsScreens.ENTER_EMAIL,
    },
    {
      stepName: translate('OnboardingOrganization.stepperSecondStep'),
      activeTillScreen: stepsScreens.FUND_YOUR_ORGANIZATION,
    },
    {
      stepName: translate('OnboardingOrganization.stepperThirdStep'),
      activeTillScreen: stepsScreens.ADD_PHOTO,
    },
  ];

  const stepsButtons = [
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
    },
    {
      alternativeBtn: `${translate('OnboardingStepper.skipStep')}. ${translate(
        'OnboardingStepper.buttonFinish',
      )}`,
      btnNextStep: translate('OnboardingStepper.buttonFinish'),
    },
  ];

  const handleTutorialFinish = () => {
    dispatch(finishTutorial(ORGANIZATION_TUTORIAL));
  };

  if (!isTutorialFinished) {
    return <TutorialOrganization onFinishTutorial={handleTutorialFinish} />;
  }

  if (isRedirect) {
    return <Redirect push to={DASHBOARD_PATH} />;
  }

  return (
    <>
      <BackgroundCurved gradient="violet">
        <OnboardingStepper
          exitPath={DASHBOARD_PATH}
          isOrganization={true}
          mb={16}
          stepperConfiguration={stepperConfiguration}
          steps={steps}
          stepsButtons={stepsButtons}
          stepsScreens={stepsScreens}
          values={values}
          onFinish={onFinish}
          onValuesChange={setValues}
        />
      </BackgroundCurved>
    </>
  );
};

const OrganizationStepEmail = ({ values, onDisabledChange, onChange }) => {
  const classes = useStyles();
  const [emailValid, setEmailValid] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleEmailStatus = (status) => {
    // Email status returns FALSE when valid
    setEmailValid(!status);
  };

  const handleEmail = (email) => {
    onChange({
      email,
    });
  };

  const handlePrivacy = ({ target: { checked } }) => {
    setPrivacy(checked);
  };

  const handleTerms = ({ target: { checked } }) => {
    setTerms(checked);
  };

  useEffect(() => {
    onDisabledChange(![emailValid, privacy, terms].every((b) => b === true));
  }, [emailValid, privacy, terms, onDisabledChange]);

  return (
    <Box className={classes.organizationEmailContainer}>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingEmail')}
      </Typography>
      <Box mt={3}>
        <VerifiedEmailInput
          isOrganization
          label={translate('Onboarding.formEmail')}
          value={values.email}
          onChange={handleEmail}
          onStatusChange={handleEmailStatus}
        />
        <Box mb={3} mt={6}>
          <Typography variant="body4">
            {translate('Onboarding.bodyEmail')}
          </Typography>
        </Box>
        <Box className={classes.CheckboxesContainer} mt={2} textAlign={'left'}>
          <Box>
            <CheckboxPrivacy checked={privacy} onChange={handlePrivacy} />
          </Box>
          <Box>
            <CheckboxTerms checked={terms} onChange={handleTerms} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const OrganizationStepPrefund = ({ onDisabledChange, values, onChange }) => {
  const classes = useStyles();
  const [isError, setIsError] = useState(false);
  const { safe, token } = useSelector((state) => state);
  const maxAmount = parseFloat(
    formatCirclesValue(ethers.BigNumber.from(token.balance)),
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
    <Box className={classes.organizationStepPrefundContainer}>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingPrefund')}
      </Typography>
      <Typography>{translate('OnboardingOrganization.bodyPrefund')}</Typography>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={1.5}>
              <TransferInfoBalanceCard
                address={safe.currentAccount}
                balance={token.balance}
                label={translate('OnboardingOrganization.formPrefundSender')}
              />
            </Box>
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
    </Box>
  );
};

const OrganizationStepWalletName = ({ onDisabledChange, values, onChange }) => {
  const classes = useStyles();

  const handleChange = (username) => {
    onChange({
      username,
    });
  };

  return (
    <Box className={classes.organizationStepWalletNameContainer}>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingWalletName')}
      </Typography>
      <Box mb={6} mt={4}>
        <VerifiedUsernameInput
          isOrganization
          label={translate('OnboardingOrganization.formUsername')}
          value={values.username}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
      <Box mb={4}>
        <Typography paragraph variant="body1">
          {translate('OnboardingOrganization.bodyUsername')}
        </Typography>
        <Typography paragraph>
          {translate('Onboarding.bodyGuidelinesUsername')}
        </Typography>
      </Box>
    </Box>
  );
};

const OrganizationStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const classes = useStyles();
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
    setPhotoUploaded(true);
  };

  useEffect(() => {
    onDisabledChange(!photoUploaded);
  }, [onDisabledChange, photoUploaded]);

  return (
    <Box className={classes.organizationStepAvatarContainer}>
      <Typography align="center" gutterBottom variant="h2">
        {translate('OnboardingOrganization.headingAvatar')}
      </Typography>
      <Box mb={4} mt={4}>
        <AvatarUploader
          shouldHaveIndicator
          value={values.avatarUrl}
          onLoadingChange={onDisabledChange}
          onUpload={handleUpload}
        />
      </Box>
    </Box>
  );
};

const OrganizationStepAddMembers = ({ onDisabledChange }) => {
  const classes = useStyles();
  const [redirectPath, setRedirectPath] = useState(null);

  const handleOnSelectFinder = (address) => {
    setRedirectPath(
      generatePath(PROFILE_PATH, {
        address,
      }),
    );
  };

  useEffect(() => {
    onDisabledChange(false);
  }, [onDisabledChange]);

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  return (
    <Box className={classes.organizationStepAddMembersContainer}>
      <Box mb={4}>
        <Typography align="center" gutterBottom variant="h2">
          {translate('OnboardingOrganization.headingAddMembers')}
        </Typography>
      </Box>
      <Finder
        basePath={ORGANIZATION_PATH}
        hasActions
        isSharedWalletCreation
        onSelect={handleOnSelectFinder}
      />
    </Box>
  );
};

const stepProps = {
  onChange: PropTypes.func.isRequired,
  onDisabledChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

OrganizationStepWalletName.propTypes = {
  ...stepProps,
};

OrganizationStepEmail.propTypes = {
  ...stepProps,
};

OrganizationStepAvatar.propTypes = {
  ...stepProps,
};

OrganizationStepPrefund.propTypes = {
  ...stepProps,
};

OrganizationStepAddMembers.propTypes = {
  ...stepProps,
};

export default OnboardingOrganization;
