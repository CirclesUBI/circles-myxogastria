import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { WELCOME_PATH } from '~/routes';

import AvatarUploader from '~/components/AvatarUploader';
import BackgroundCurved from '~/components/BackgroundCurved';
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

const moveUpFront = (theme) => ({
  position: 'relative',
  zIndex: theme.zIndex.layer1,
});
const useStyles = makeStyles((theme) => ({
  dotList: {
    fontSize: '16px',
    fontWeight: '300',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '15px',
    position: 'relative',
    textAlign: 'left',
    listStyleType: 'none',
    '&:before': {
      position: 'absolute',
      content: '""',
      top: '12px',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      left: 0,
      background: theme.custom.colors.black,
    },
    '&::marker': {
      display: 'none',
    },
  },
  userStepEmailContainer: moveUpFront(theme),
  userStepUsernameContainer: moveUpFront(theme),
  userStepAvatarContainer: moveUpFront(theme),
  userStepSecureWalletContainer: moveUpFront(theme),
  userStepSeedPhrase: moveUpFront(theme),
  userStepSeedChallenge: moveUpFront(theme),
  userStepSecureWalletBodyTxt: {
    padding: '45px',
  },
  CheckboxesContainer: {
    '& a': {
      color: theme.custom.colors.blueRibbon,
    },
  },
  dialogContentContainer: {
    '& >p': {
      marginBottom: '30px',
    },
  },
  userStepSeedPhraseTxtContainer: {
    padding: '0 45px',
  },
  userStepSeedPhraseLink: {
    fontSize: '16px',
    fontWeight: 300,
    marginTop: '10px',
    display: 'block',
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
    OnboardingStepEmail,
    OnboardingStepUsername,
    OnboardingStepAvatar,
    OnboardingStepSecureWallet,
    OnboardingStepSeedPhrase,
    OnboardingStepSeedChallenge,
  ];

  const screenNames = {
    ENTER_EMAIL: 0,
    CREATE_YOUR_USERNAME: 1,
    ADD_PHOTO: 2,
    SECURE_YOUR_WALLET: 3,
    SAVE_YOUR_SEEDPHRASE: 4,
    SEEDPHRASE_CHALLENGE: 5,
  };

  const stepperConfiguration = [
    {
      stepName: translate('Onboarding.stepperFirstStep'),
      activeTillScreen: screenNames.ENTER_EMAIL,
    },
    {
      stepName: translate('Onboarding.stepperSecondStep'),
      activeTillScreen: screenNames.SAVE_YOUR_SEEDPHRASE,
    },
    {
      stepName: translate('Onboarding.stepperThirdStep'),
      activeTillScreen: screenNames.SEEDPHRASE_CHALLENGE,
    },
  ];

  const stepsButtons = [
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: translate('OnboardingStepper.skipStep'),
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: '',
    },
    {
      btnNextStep: translate('OnboardingStepper.buttonNextStep'),
      additionalBtn: '',
    },
  ];

  return (
    <BackgroundCurved gradient="turquoise">
      <OnboardingStepper
        exitPath={WELCOME_PATH}
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
  );
};

const OnboardingStepEmail = ({ values, onDisabledChange, onChange }) => {
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
    <Box className={classes.userStepEmailContainer}>
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
        <Box mt={2} textAlign={'left'}>
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

const OnboardingStepUsername = ({ onDisabledChange, values, onChange }) => {
  const classes = useStyles();
  const handleChange = (username) => {
    onChange({
      username,
    });
  };

  return (
    <Box className={classes.userStepUsernameContainer}>
      <Typography align="center" gutterBottom variant="h6">
        {translate('Onboarding.headingUsername')}
      </Typography>
      <Box mt={3}>
        <VerifiedUsernameInput
          label={translate('Onboarding.formUsername')}
          value={values.username}
          onChange={handleChange}
          onStatusChange={onDisabledChange}
        />
      </Box>
      <Box mb={3} mt={6}>
        <Typography className="lightGreyText">
          {translate('Onboarding.bodyUsername')}
        </Typography>
      </Box>
    </Box>
  );
};

const OnboardingStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const classes = useStyles();
  const handleUpload = (avatarUrl) => {
    onChange({
      avatarUrl,
    });
  };

  return (
    <Box className={classes.userStepAvatarContainer}>
      <Typography align="center" gutterBottom variant="h6">
        {translate('Onboarding.headingAvatar')}
      </Typography>
      <Box mt={4}>
        <AvatarUploader
          value={values.avatarUrl}
          onLoadingChange={onDisabledChange}
          onUpload={handleUpload}
        />
      </Box>
    </Box>
  );
};

const OnboardingStepSecureWallet = ({ onDisabledChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const handleOpen = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const dialogContent = (
    <Box className={classes.dialogContentContainer}>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP1')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP2')}
      </Typography>
      <Typography paragraph>
        {translate('Onboarding.bodyAboutSeedPhraseP3')}
      </Typography>
    </Box>
  );

  useEffect(() => {
    onDisabledChange(false);
  }, [onDisabledChange]);

  return (
    <Box className={classes.userStepSecureWalletContainer}>
      <DialogInfo
        dialogContent={dialogContent}
        handleClose={handleClose}
        id="info"
        isOpen={isOpen}
        title={translate('Onboarding.headingAboutSeedPhrase')}
      />
      <Typography align="center" gutterBottom variant="h6">
        {translate('Onboarding.headingSecureWallet')}
      </Typography>
      <Box className={classes.userStepSecureWalletBodyTxt}>
        <Typography className="lightGreyText" paragraph>
          {translate('Onboarding.bodySecureWalletP1A')}
          <ExternalLink href="#" onClick={handleOpen}>
            {translate('Onboarding.bodySecureWalletP1Link')}
          </ExternalLink>
          {translate('Onboarding.bodySecureWalletP1B')}
        </Typography>
        <Typography className="lightGreyText" paragraph>
          {translate('Onboarding.bodySecureWalletP2')}
        </Typography>
      </Box>
    </Box>
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
    <Box p={2}>
      <Typography align="left" paragraph>
        {translate('Onboarding.bodySaveSeedPhraseHelper')}
      </Typography>
      <li className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper1')}
      </li>
      <li className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper2')}
      </li>
      <li className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper3')}
      </li>
      <li className={classes.dotList}>
        {translate('Onboarding.listItemSaveSeedPhraseHelper4')}
      </li>
    </Box>
  );

  return (
    <Box className={classes.userStepSeedPhrase}>
      <DialogInfo
        dialogContent={dialogContent}
        handleClose={handleClose}
        id="info"
        isOpen={isOpen}
        title={translate('Onboarding.headingSaveSeedPhraseHelper')}
      />
      <Typography align="center" gutterBottom variant="h6">
        {translate('Onboarding.headingSeedPhrase')}
      </Typography>
      <Box className={classes.userStepSeedPhraseTxtContainer}>
        <Typography className="lightGreyText">
          {translate('Onboarding.bodySeedPhrase')}
        </Typography>
      </Box>
      <Box my={1}>
        <Mnemonic text={mnemonic} />
      </Box>
      <Box mb={1}>
        <Typography className="lightGreyText">
          {translate('Onboarding.footerSeedPhrase')}
        </Typography>
        <ExternalLink
          className={classes.userStepSeedPhraseLink}
          href="#"
          onClick={handleOpen}
        >
          {translate('Onboarding.linkHelperSaveSeedPhrase')}
        </ExternalLink>
      </Box>
      <Footer>
        <ButtonClipboard fullWidth isOutline text={mnemonic}>
          {translate('SeedPhrase.buttonCopyToClipboard')}
        </ButtonClipboard>
      </Footer>
    </Box>
  );
};

const OnboardingStepSeedChallenge = ({ onDisabledChange }) => {
  const [challenge, setChallenge] = useState('');
  const classes = useStyles();

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
    <Box className={classes.userStepSeedChallenge}>
      <Typography align="center" gutterBottom variant="h6">
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
    </Box>
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
