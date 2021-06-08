import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import AvatarUploader from '~/components/AvatarUploader';
import CheckboxPrivacy from '~/components/CheckboxPrivacy';
import CheckboxTerms from '~/components/CheckboxTerms';
import Input from '~/components/Input';
import Mnemonic from '~/components/Mnemonic';
import OnboardingStepper from '~/components/OnboardingStepper';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { WELCOME_PATH } from '~/routes';
import { createNewAccount } from '~/store/onboarding/actions';
import { showSpinnerOverlay, hideSpinnerOverlay } from '~/store/app/actions';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const Onboarding = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    avatarUrl: '',
    email: '',
    username: '',
  });

  const onFinish = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(
        createNewAccount(values.username, values.email, values.avatarUrl),
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
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingEmail')}
      </Typography>
      <Typography>{translate('Onboarding.bodyEmail')}</Typography>
      <Box mt={3}>
        <VerifiedEmailInput
          label={translate('Onboarding.formEmail')}
          value={values.email}
          onChange={handleEmail}
          onStatusChange={handleEmailStatus}
        />
        <Box mt={2} textAlign={'left'}>
          <Box>
            <CheckboxPrivacy checked={privacy} onChange={handlePrivacy} />
          </Box>
          <Box>
            <CheckboxTerms checked={terms} onChange={handleTerms} />
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

const OnboardingStepSeedPhrase = ({ onDisabledChange }) => {
  const mnemonic = useMemo(() => {
    const privateKey = getPrivateKey();
    return toSeedPhrase(privateKey);
  }, []);

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
        <Mnemonic text={mnemonic} />
      </Box>
    </Fragment>
  );
};

const OnboardingStepSeedChallenge = ({ onDisabledChange }) => {
  const [challenge, setChallenge] = useState('');

  const wordIndex = useMemo(() => {
    return Math.floor(Math.random() * 24);
  }, []);

  const handleChange = (event) => {
    setChallenge(event.target.value);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    return false;
  };

  const isValid = useMemo(() => {
    const privateKey = getPrivateKey();
    const answer = toSeedPhrase(privateKey).split(' ')[wordIndex];
    return challenge.toLowerCase() === answer.toLowerCase();
  }, [challenge, wordIndex]);

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
