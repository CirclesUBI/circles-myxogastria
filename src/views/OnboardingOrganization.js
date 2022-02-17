import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath } from 'react-router';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH, PROFILE_PATH } from '~/routes';
import { ORGANIZATION_PATH } from '~/routes';

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
import web3 from '~/services/web3';
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
  organizationStepUsernameContainer: moveUpFront(theme),
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
    OrganizationStepEmail,
    OrganizationStepPrefund,
    OrganizationStepUsername,
    OrganizationStepAvatar,
    OrganizationStepAddMembers,
  ];

  const screenNames = {
    ENTER_EMAIL: 0,
    FUND_YOUR_ORGANIZATION: 1,
    CREATE_YOUR_USERNAME: 2,
    ADD_PHOTO: 3,
    ADD_MEMBERS: 4,
  };

  const stepperConfiguration = [
    {
      stepName: translate('OnboardingOrganization.stepperFirstStep'),
      activeTillScreen: screenNames.ENTER_EMAIL,
    },
    {
      stepName: translate('OnboardingOrganization.stepperSecondStep'),
      activeTillScreen: screenNames.CREATE_YOUR_USERNAME,
    },
    {
      stepName: translate('OnboardingOrganization.stepperThirdStep'),
      activeTillScreen: screenNames.ADD_MEMBERS,
    },
  ];

  const stepsButtons = [
    {
      btnNextStep: translate('OnboardingStepper.buttonSubmit'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonFinish'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonSubmit'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonSubmit'),
      additionalBtn: translate('OnboardingStepper.skipStep'),
    },
    {
      btnNextStep: translate('OnboardingStepper.skipStep'),
      additionalBtn: '',
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
      <BackgroundCurved gradient="orange">
        <OnboardingStepper
          exitPath={DASHBOARD_PATH}
          isHorizontalStepper={true}
          mb={16}
          stepperConfiguration={stepperConfiguration}
          steps={steps}
          stepsButtons={stepsButtons}
          todoRemoveFlag={true}
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
      <Typography align="center" gutterBottom variant="h6">
        {translate('Onboarding.headingEmail')}
      </Typography>
      <Box mt={3}>
        <VerifiedEmailInput
          label={translate('Onboarding.formEmail')}
          value={values.email}
          onChange={handleEmail}
          onStatusChange={handleEmailStatus}
        />
        <Box mb={3} mt={6}>
          <Typography className="lightGreyText">
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
    <Box className={classes.organizationStepPrefundContainer}>
      <Typography align="center" gutterBottom variant="h6">
        {translate('OnboardingOrganization.headingPrefund')}
      </Typography>
      <Typography className="lightGreyText">
        {translate('OnboardingOrganization.bodyPrefund')}
      </Typography>
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

const OrganizationStepUsername = ({ onDisabledChange, values, onChange }) => {
  const classes = useStyles();

  const handleChange = (username) => {
    onChange({
      username,
    });
  };

  return (
    <Box className={classes.organizationStepUsernameContainer}>
      <Typography align="center" gutterBottom variant="h6">
        {translate('OnboardingOrganization.headingUsername')}
      </Typography>
      <Box mb={6} mt={4}>
        <VerifiedUsernameInput
          label={translate('OnboardingOrganization.formUsername')}
          value={values.username}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
      <Box mb={4}>
        <Typography mb={18}>
          {translate('OnboardingOrganization.bodyUsername')}
        </Typography>
      </Box>
    </Box>
  );
};

const OrganizationStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const classes = useStyles();

  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
  };

  return (
    <Box className={classes.organizationStepAvatarContainer}>
      <Typography align="center" gutterBottom variant="h6">
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

const OrganizationStepAddMembers = () => {
  const classes = useStyles();
  const [redirectPath, setRedirectPath] = useState(null);

  const handleOnSelectFinder = (address) => {
    setRedirectPath(
      generatePath(PROFILE_PATH, {
        address,
      }),
    );
  };

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  return (
    <Box className={classes.organizationStepAddMembersContainer}>
      <Box mb={4}>
        <Typography align="center" gutterBottom variant="h6">
          {translate('OnboardingOrganization.headingAddMembers')}
        </Typography>
      </Box>
      <Finder
        basePath={ORGANIZATION_PATH}
        hasActions
        isWalletCreation
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

OrganizationStepUsername.propTypes = {
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

export default OnboardingOrganization;
