import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import mime from 'mime/lite';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MobileStepper,
  Paper,
  Typography,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonClipboard from '~/components/ButtonClipboard';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Input from '~/components/Input';
import Logo from '~/components/Logo';
import View from '~/components/View';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';
import { WELCOME_PATH } from '~/routes';
import { createNewAccount } from '~/store/onboarding/actions';
import { showSpinnerOverlay, hideSpinnerOverlay } from '~/store/app/actions';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const DEBOUNCE_DELAY = 500;
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const useStyles = makeStyles((theme) => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    padding: 0,
  },
  mnemonicItem: {
    width: theme.spacing(9),
    padding: theme.spacing(0.5),
    textAlign: 'center',
  },
  avatarUpload: {
    margin: '0 auto',
    width: theme.spacing(15),
    height: theme.spacing(15),
    color: theme.palette.text.primary,
    fontSize: '30px',
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.text.primary}`,
    cursor: 'pointer',
  },
}));

const Onboarding = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState(0);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [values, setValues] = useState({
    avatarUrl: '',
    email: '',
    username: '',
  });

  const onChange = (updatedValues) => {
    setValues({
      ...values,
      ...updatedValues,
    });
  };

  const onDisabledChange = (updatedValue) => {
    setIsDisabled(updatedValue);
  };

  const onNext = () => {
    setCurrent(current + 1);
    setIsDisabled(true);
  };

  const onPrevious = () => {
    setCurrent(current - 1);
  };

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

  const onExit = () => {
    setIsRedirect(true);
  };

  const steps = [
    OnboardingStepUsername,
    OnboardingStepEmail,
    OnboardingStepSeedPhrase,
    OnboardingStepSeedChallenge,
    OnboardingStepAvatar,
  ];

  const OnboardingCurrentStep = steps[current];

  const isLastSlide = current === steps.length - 1;

  if (isRedirect) {
    return <Redirect push to={WELCOME_PATH} />;
  }

  return (
    <Fragment>
      <Header>
        <MobileStepper
          activeStep={current}
          backButton={
            current === 0 ? (
              <ButtonBack />
            ) : (
              <IconButton onClick={onPrevious}>
                <IconBack />
              </IconButton>
            )
          }
          classes={{
            root: classes.onboardingMobileStepper,
            progress: classes.onboardingMobileStepperProgress,
          }}
          nextButton={
            <IconButton onClick={onExit}>
              <IconClose />
            </IconButton>
          }
          position="static"
          steps={steps.length + 1}
          variant="progress"
        />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box my={6}>
            <Logo />
          </Box>
          <Box textAlign="center">
            <OnboardingCurrentStep
              values={values}
              onChange={onChange}
              onDisabledChange={onDisabledChange}
            />
          </Box>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={isLastSlide ? onFinish : onNext}
        >
          {isLastSlide
            ? translate('Onboarding.buttonFinish')
            : translate('Onboarding.buttonNextStep')}
        </Button>
      </Footer>
    </Fragment>
  );
};

const OnboardingStepUsername = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const debouncedUsernameCheck = debounce(async (username) => {
    try {
      await core.utils.requestAPI({
        path: ['users'],
        method: 'POST',
        data: {
          username,
        },
      });

      setIsError(false);
    } catch (error) {
      if (error.request.status === 400) {
        setErrorMessage(translate('Onboarding.formUsernameInvalidFormat'));
      } else if (error.request.status === 409) {
        setErrorMessage(translate('Onboarding.formUsernameTaken'));
      } else {
        setErrorMessage(translate('Onboarding.formUnknownError'));
      }

      setIsError(true);
    }

    setIsLoading(false);
  }, DEBOUNCE_DELAY);

  const verify = useCallback((username) => {
    setIsError(false);
    setIsLoading(true);
    debouncedUsernameCheck(username);
  }, []);

  const onChange = (event) => {
    const { value: username } = event.target;
    props.onChange({
      username,
    });
    verify(username);
  };

  useEffect(() => {
    const isEmpty = props.values.username.length === 0;
    props.onDisabledChange(isEmpty || isError || isLoading);
  }, [props.values, isError, isLoading]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingUsername')}
      </Typography>
      <Typography>{translate('Onboarding.bodyUsername')}</Typography>
      <Box mt={4}>
        <Input
          errorMessage={errorMessage}
          id="username"
          inputProps={{ maxLength: 24 }}
          isError={isError}
          isLoading={isLoading}
          label={translate('Onboarding.formUsername')}
          type="text"
          value={props.values.username}
          onChange={onChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepEmail = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const debouncedEmailCheck = debounce(async (email) => {
    try {
      await core.utils.requestAPI({
        path: ['users'],
        method: 'POST',
        data: {
          email,
        },
      });

      setIsError(false);
    } catch {
      setIsError(true);
    }

    setIsLoading(false);
  }, DEBOUNCE_DELAY);

  const verify = useCallback((email) => {
    if (email.length < 3) {
      setIsError(true);
      setIsLoading(false);
      return;
    }

    setIsError(false);
    setIsLoading(true);

    debouncedEmailCheck(email);
  }, []);

  const onChange = (event) => {
    const { value: email } = event.target;
    props.onChange({
      email,
    });
    verify(email);
  };

  useEffect(() => {
    props.onDisabledChange(
      !props.values.email.length > 0 || isError || isLoading,
    );
  }, [props.values.email, isError, isLoading]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingEmail')}
      </Typography>
      <Typography>{translate('Onboarding.bodyEmail')}</Typography>
      <Box mt={4}>
        <Input
          errorMessage={translate('Onboarding.formEmailInvalid')}
          id="email"
          isError={isError}
          isLoading={isLoading}
          label={translate('Onboarding.formEmail')}
          type="email"
          value={props.values.email}
          onChange={onChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepSeedPhrase = (props) => {
  const classes = useStyles();

  const mnemonic = useMemo(() => {
    const privateKey = getPrivateKey();
    return toSeedPhrase(privateKey);
  }, []);

  useEffect(() => {
    props.onDisabledChange(false);
  }, []);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingSeedPhrase')}
      </Typography>
      <Typography>{translate('Onboarding.bodySeedPhrase')}</Typography>
      <Box my={4}>
        <Grid container spacing={2}>
          {mnemonic.split(' ').map((word, index) => {
            return (
              <Grid item key={index} xs>
                <Paper className={classes.mnemonicItem}>{word}</Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <ButtonClipboard fullWidth isOutline text={mnemonic}>
        {translate('Onboarding.buttonCopyToClipboard')}
      </ButtonClipboard>
    </Fragment>
  );
};

const OnboardingStepSeedChallenge = (props) => {
  const { pendingNonce } = useSelector((state) => state.safe);
  const [challenge, setChallenge] = useState('');

  const wordIndex = useMemo(() => {
    return Math.floor(Math.random() * 24);
  }, []);

  const onChange = (event) => {
    setChallenge(event.target.value);
  };

  const isValid = useMemo(() => {
    const privateKey = getPrivateKey();
    const answer = toSeedPhrase(privateKey).split(' ')[wordIndex];
    return challenge === answer;
  }, [challenge, pendingNonce, wordIndex]);

  useEffect(() => {
    props.onDisabledChange(!isValid);
  }, [isValid]);

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
          errorMessage={translate('Onboarding.formSeedPhraseChallengeInvalid')}
          id="challenge"
          isError={!isValid && challenge.length > 0}
          label={translate('Onboarding.formSeedPhraseChallenge')}
          name="challenge"
          type="text"
          value={challenge}
          onChange={onChange}
        />
      </Box>
    </Fragment>
  );
};

const OnboardingStepAvatar = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputElem = useRef();

  const onUpload = (event) => {
    event.preventDefault();
    fileInputElem.current.click();
  };

  const onChangeFiles = async (event) => {
    setIsLoading(true);

    const { files } = event.target;
    if (files.length === 0) {
      return;
    }

    try {
      const result = await core.utils.requestAPI({
        path: ['uploads', 'avatar'],
        method: 'POST',
        data: [...files].reduce((acc, file) => {
          acc.append('files', file, file.name);
          return acc;
        }, new FormData()),
      });

      props.onChange({
        avatarUrl: result.data.url,
      });
    } catch (error) {
      dispatch(
        notify({
          text: translate('Onboarding.errorAvatarUpload'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    setIsLoading(false);
  };

  const fileTypesStr = IMAGE_FILE_TYPES.map((ext) => {
    return mime.getType(ext);
  }).join(',');

  useEffect(() => {
    props.onDisabledChange(!props.values.avatarUrl || isLoading);
  }, [props.values.avatarUrl, isLoading]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Onboarding.headingAvatar')}
      </Typography>
      <Typography>{translate('Onboarding.bodyAvatar')}</Typography>
      <Box mt={4}>
        <Avatar
          className={classes.avatarUpload}
          src={isLoading ? null : props.values.avatarUrl}
          onClick={onUpload}
        >
          {isLoading ? <CircularProgress /> : '+'}
        </Avatar>
        <input
          accept={fileTypesStr}
          ref={fileInputElem}
          style={{ display: 'none' }}
          type="file"
          onChange={onChangeFiles}
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
