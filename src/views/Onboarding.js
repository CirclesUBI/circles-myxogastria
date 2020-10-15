import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import AvatarUploader from '~/components/AvatarUploader';
import Input from '~/components/Input';
import Mnemonic from '~/components/Mnemonic';
import OnboardingStepper from '~/components/OnboardingStepper';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedPasswordInput from '~/components/VerifiedPasswordInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { WELCOME_PATH } from '~/routes';
import { createNewAccount } from '~/store/onboarding/actions';
import { createWallet } from '~/store/wallet/actions';
import { generateNewMnemonic } from '~/services/wallet';
import { showSpinnerOverlay, hideSpinnerOverlay } from '~/store/app/actions';

const Onboarding = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    avatarUrl: '',
    email: '',
    username: '',
    password: '',
    mnemonic: null,
  });

  useEffect(() => {
    const mnemonic = generateNewMnemonic();

    setValues((values) => ({
      ...values,
      mnemonic,
    }));
  }, []);

  const onFinish = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(createWallet(values.mnemonic, values.password));

      await dispatch(
        createNewAccount(
          values.username,
          values.email,
          values.avatarUrl,
          values.password,
        ),
      );

      dispatch(
        notify({
          text: translate('Onboarding.successOnboardingComplete'),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch (error) {
      logError(error);

      const errorMessage = formatErrorMessage(error);

      dispatch(
        notify({
          text: translate('Onboarding.errorSignup', {
            errorMessage,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  const steps = [
    OnboardingStepUsername,
    OnboardingStepEmail,
    OnboardingStepPassword,
    OnboardingStepSeedPhrase,
    OnboardingStepSeedChallenge,
    OnboardingStepAvatar,
  ];

  return (
    <OnboardingStepper
      exitPath={WELCOME_PATH}
      steps={steps}
      values={values}
      onFinish={onFinish}
      onValuesChange={setValues}
    />
  );
};

const OnboardingStepUsername = ({ onDisabledChange, values, onChange }) => {
  const handleChange = (username) => {
    onChange({
      username,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingUsername')}
      </Typography>
      <Typography>{translate('Onboarding.bodyUsername')}</Typography>
      <Box mt={4}>
        <VerifiedUsernameInput
          label={translate('Onboarding.formUsername')}
          value={values.username}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepEmail = ({ values, onDisabledChange, onChange }) => {
  const handleChange = (email) => {
    onChange({
      email,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingEmail')}
      </Typography>
      <Typography>{translate('Onboarding.bodyEmail')}</Typography>
      <Box mt={4}>
        <VerifiedEmailInput
          label={translate('Onboarding.formEmail')}
          value={values.email}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepPassword = ({ onDisabledChange, onChange, values }) => {
  const handleChange = (password) => {
    onChange({
      password,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingPassword')}
      </Typography>
      <Typography>{translate('Onboarding.bodyPassword')}</Typography>
      <Box my={4}>
        <VerifiedPasswordInput
          value={values.password}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepSeedPhrase = ({ values, onDisabledChange }) => {
  useEffect(() => {
    onDisabledChange(false);
  }, [onDisabledChange]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingSeedPhrase')}
      </Typography>
      <Typography>{translate('Onboarding.bodySeedPhrase')}</Typography>
      <Box my={4}>
        <Mnemonic text={values.mnemonic} />
      </Box>
    </Fragment>
  );
};

const OnboardingStepSeedChallenge = ({ values, onDisabledChange }) => {
  const [challenge, setChallenge] = useState('');

  const wordIndex = useMemo(() => {
    return Math.floor(Math.random() * values.mnemonic.split(' ').length);
  }, [values.mnemonic]);

  const handleChange = (event) => {
    setChallenge(event.target.value);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    return false;
  };

  const isValid = useMemo(() => {
    const answer = values.mnemonic.split(' ')[wordIndex];
    return challenge === answer;
  }, [challenge, wordIndex, values.mnemonic]);

  useEffect(() => {
    onDisabledChange(!isValid);
  }, [onDisabledChange, isValid]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingSeedPhraseChallenge')}
      </Typography>
      <Typography>
        {translate('Onboarding.bodySeedPhraseChallenge', {
          wordIndex: wordIndex + 1,
        })}
      </Typography>
      <Box mt={4}>
        <Input
          autoComplete="off"
          errorMessage={translate('Onboarding.formSeedPhraseChallengeInvalid')}
          id="challenge"
          isError={!isValid && challenge.length > 0}
          label={translate('Onboarding.formSeedPhraseChallenge')}
          name="challenge"
          type="text"
          value={challenge}
          onChange={handleChange}
          onDrag={handlePaste}
          onDrop={handlePaste}
          onPaste={handlePaste}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
  };

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingAvatar')}
      </Typography>
      <Typography>{translate('Onboarding.bodyAvatar')}</Typography>
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

const stepProps = {
  onChange: PropTypes.func.isRequired,
  onDisabledChange: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

OnboardingStepUsername.propTypes = {
  ...stepProps,
};

OnboardingStepEmail.propTypes = {
  ...stepProps,
};

OnboardingStepPassword.propTypes = {
  ...stepProps,
};

OnboardingStepSeedPhrase.propTypes = {
  ...stepProps,
};

OnboardingStepSeedChallenge.propTypes = {
  ...stepProps,
};

OnboardingStepAvatar.propTypes = {
  ...stepProps,
};

export default Onboarding;
