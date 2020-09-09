import PropTypes from 'prop-types';
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import mime from 'mime/lite';
import {
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  MobileStepper,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ButtonClipboard from '~/components/ButtonClipboard';
import Header from '~/components/Header';
import View from '~/components/View';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import { IconCheck } from '~/styles/icons';
import { createNewAccount } from '~/store/onboarding/actions';
import { showSpinnerOverlay, hideSpinnerOverlay } from '~/store/app/actions';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const DEBOUNCE_DELAY = 500;
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const Onboarding = () => {
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [isRedirect, setIsRedirect] = useState(false);

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

  const onNext = () => {
    setCurrent(current + 1);
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
    } catch (error) {
      // @TODO Show error to user
      console.error(error);
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

  if (isRedirect) {
    return <Redirect to={'/welcome'} />;
  }

  return (
    <Fragment>
      <Header>
        <MobileStepper
          activeStep={current}
          backButton={
            <Button size="small" onClick={current === 0 ? onExit : onPrevious}>
              Back
            </Button>
          }
          nextButton={
            <Button size="small" onClick={onExit}>
              Exit
            </Button>
          }
          position="static"
          steps={steps.length + 1}
          variant="progress"
        />
      </Header>

      <View>
        <OnboardingCurrentStep
          values={values}
          onChange={onChange}
          onNext={current === steps.length - 1 ? onFinish : onNext}
        />
      </View>
    </Fragment>
  );
};

const OnboardingStepUsername = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit = () => {
    props.onNext();
  };

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
      if (error.code === 400) {
        // @TODO: Show message
        // Invalid format
      } else if (error.code === 409) {
        // @TODO: Show message
        // Name already taken
      }

      setIsError(true);
    }

    setIsLoading(false);
  }, DEBOUNCE_DELAY);

  const verify = useCallback((username) => {
    if (username.length < 3) {
      // @TODO: Show message, too short
      setIsError(true);
      setIsLoading(false);
      return;
    }

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

  const isEmpty = props.values.username.length === 0;

  return (
    <Fragment>
      <OnboardingInput
        errorMessage=""
        id="username"
        inputProps={{ maxLength: 24 }}
        isError={isError}
        isLoading={isLoading}
        label="Username"
        type="text"
        value={props.values.username}
        onChange={onChange}
      />

      <Button disabled={isEmpty || isError || isLoading} onClick={onSubmit}>
        Submit
      </Button>
    </Fragment>
  );
};

const OnboardingStepEmail = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit = () => {
    props.onNext();
  };

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
      // @TODO: Show message, too short
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

  return (
    <Fragment>
      <OnboardingInput
        errorMessage=""
        id="email"
        isError={isError}
        isLoading={isLoading}
        label="E-Mail-Address"
        type="email"
        value={props.values.email}
        onChange={onChange}
      />

      <Button
        disabled={!props.values.email || isError || isLoading}
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Fragment>
  );
};

const OnboardingStepSeedPhrase = (props) => {
  const mnemonic = useMemo(() => {
    const privateKey = getPrivateKey();
    return toSeedPhrase(privateKey);
  }, []);

  return (
    <Fragment>
      <p>Seed Phrase</p>

      {mnemonic.split(' ').map((word, index) => {
        return <span key={index}>{word} - </span>;
      })}

      <ButtonClipboard text={mnemonic}>Save to clipboard</ButtonClipboard>
      <Button onClick={props.onNext}>I saved it!</Button>
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

  return (
    <Fragment>
      <p>Please enter word {wordIndex + 1} in your seed phrase</p>

      <OnboardingInput
        id="challenge"
        label="Word"
        name="challenge"
        type="text"
        value={challenge}
        onChange={onChange}
      />

      <Button disabled={!isValid} onClick={props.onNext}>
        Submit
      </Button>
    </Fragment>
  );
};

const OnboardingStepAvatar = (props) => {
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
      // @TODO: Show warning
    }

    setIsLoading(false);
  };

  const fileTypesStr = IMAGE_FILE_TYPES.map((ext) => {
    return mime.getType(ext);
  }).join(',');

  return (
    <Fragment>
      <p>Profile image</p>

      {props.values.avatarUrl && (
        <img src={props.values.avatarUrl} width="100" />
      )}

      <input
        accept={fileTypesStr}
        ref={fileInputElem}
        style={{ display: 'none' }}
        type="file"
        onChange={onChangeFiles}
      />

      <Button disabled={isLoading} onClick={onUpload}>
        Upload
      </Button>

      <Button
        disabled={!props.values.avatarUrl || isLoading}
        onClick={props.onNext}
      >
        Continue
      </Button>
    </Fragment>
  );
};

// @TODO: Move this into own file
const OnboardingInput = ({
  isError,
  id,
  errorMessage,
  label,
  isLoading,
  value,
  ...props
}) => {
  return (
    <FormControl error={isError} fullWidth>
      <InputLabel htmlFor={id}>{label}</InputLabel>

      <Input
        endAdornment={
          isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={15} />
            </InputAdornment>
          ) : (
            !isError && !value.length === 0 && <IconCheck />
          )
        }
        id={id}
        value={value}
        {...props}
      />

      {isError && errorMessage && (
        <FormHelperText>{errorMessage}</FormHelperText>
      )}
    </FormControl>
  );
};

const stepProps = {
  onChange: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
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
