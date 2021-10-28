import { Box, ListItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { WELCOME_PATH } from '~/routes';

import AvatarUploader from '~/components/AvatarUploader';
import ButtonClipboard from '~/components/ButtonClipboard';
import CheckboxPrivacy from '~/components/CheckboxPrivacy';
import CheckboxTerms from '~/components/CheckboxTerms';
import DialogInfo from '~/components/DialogInfo';
import ExternalLink from '~/components/ExternalLink';
import Footer from '~/components/Footer';
import Input from '~/components/Input';
import Mnemonic from '~/components/Mnemonic';
import OnboardingStepper from '~/components/OnboardingStepper';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import translate from '~/services/locale';
import { getPrivateKey, toSeedPhrase } from '~/services/wallet';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { createNewAccount } from '~/store/onboarding/actions';
import logError, { formatErrorMessage } from '~/utils/debug';

const useStyles = makeStyles(() => ({
  dotList: {
    fontSize: '16px',
    paddingTop: '8px',
    paddingBottom: '0px',
    display: 'list-item',
  },
}));

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
    OnboardingStepSecureWallet,
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

const OnboardingStepSecureWallet = ({ onDisabledChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const dialogContent = (
    <Fragment>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP1')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP2')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP3')}
      </Typography>
    </Fragment>
  );

  useEffect(() => {
    onDisabledChange(false);
  }, [onDisabledChange]);

  return (
    <Fragment>
      <DialogInfo
        dialogContent={dialogContent}
        handleClose={handleClose}
        id="info"
        isOpen={isOpen}
        title={translate('Onboarding.headingAboutSeedPhrase')}
      />
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingSecureWallet')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodySecureWalletP1A')}
        <ExternalLink href="#" underline="always" onClick={handleOpen}>
          {translate('Onboarding.bodySecureWalletP1Link')}
        </ExternalLink>
        {translate('Onboarding.bodySecureWalletP1B')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodySecureWalletP2')}
      </Typography>
    </Fragment>
  );
};

const OnboardingStepSeedPhrase = ({ onDisabledChange }) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  const mnemonic = useMemo(() => {
    const privateKey = getPrivateKey();
    return toSeedPhrase(privateKey);
  }, []);

  const handleOpen = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    onDisabledChange(false);
  }, [onDisabledChange]);

  const dialogContent = (
    <Fragment>
      <Typography paragraph>
        {translate('Onboarding.bodySaveSeedPhraseHelper')}
      </Typography>
      <ListItem className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper1')}
      </ListItem>
      <ListItem className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper2')}
      </ListItem>
      <ListItem className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper3')}
      </ListItem>
      <ListItem className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper4')}
      </ListItem>
    </Fragment>
  );

  return (
    <Fragment>
      <DialogInfo
        dialogContent={dialogContent}
        handleClose={handleClose}
        id="info"
        isOpen={isOpen}
        title={translate('Onboarding.headingSaveSeedPhraseHelper')}
      />
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingSeedPhrase')}
      </Typography>
      <Typography>{translate('Onboarding.bodySeedPhrase')}</Typography>
      <Box my={4}>
        <Mnemonic text={mnemonic} />
      </Box>
      <Typography>{translate('Onboarding.footerSeedPhrase')}</Typography>
      <ExternalLink href="#" underline="always" onClick={handleOpen}>
        {translate('Onboarding.linkHelperSaveSeedPhrase')}
      </ExternalLink>
      <Footer>
        <ButtonClipboard fullWidth isOutline text={mnemonic}>
          {translate('SeedPhrase.buttonCopyToClipboard')}
        </ButtonClipboard>
      </Footer>
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

OnboardingStepSecureWallet.propTypes = {
  isOpen: PropTypes.bool,
  ...stepProps,
};

OnboardingStepSeedPhrase.propTypes = {
  isOpen: PropTypes.bool,
  ...stepProps,
};

OnboardingStepSeedChallenge.propTypes = {
  ...stepProps,
};

OnboardingStepAvatar.propTypes = {
  ...stepProps,
};

export default Onboarding;
