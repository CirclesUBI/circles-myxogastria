import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import mime from 'mime/lite';
import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  MobileStepper,
  Typography,
} from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';

import AppNote from '~/components/AppNote';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
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

const DEBOUNCE_DELAY = 500;
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const useStyles = makeStyles((theme) => ({
  onboardingMobileStepper: {
    flexGrow: 1,
    padding: 0,
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

const Organization = () => {
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
          text: translate('Organization.successOnboardingComplete'),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch (error) {
      logError(error);

      const errorMessage = formatErrorMessage(error);

      dispatch(
        notify({
          text: translate('Organization.errorSignup', {
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

  const steps = [OrganizationStepUsername, OrganizationStepAvatar];

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
        <AppNote />
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={isLastSlide ? onFinish : onNext}
        >
          {isLastSlide
            ? translate('Organization.buttonFinish')
            : translate('Organization.buttonNextStep')}
        </Button>
      </Footer>
    </Fragment>
  );
};

const OrganizationStepUsername = ({ onDisabledChange, values, onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
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
          setErrorMessage(translate('Organization.formUsernameInvalidFormat'));
        } else if (error.request.status === 409) {
          setErrorMessage(translate('Organization.formUsernameTaken'));
        } else {
          setErrorMessage(translate('Organization.formUnknownError'));
        }

        setIsError(true);
      }

      setIsLoading(false);
    }, DEBOUNCE_DELAY),
    [],
  );

  const verify = useCallback(
    (username) => {
      setIsError(false);
      setIsLoading(true);
      debouncedUsernameCheck(username);
    },
    [debouncedUsernameCheck],
  );

  const handleChange = (event) => {
    const { value: username } = event.target;
    onChange({
      username,
    });
    verify(username);
  };

  useEffect(() => {
    const isEmpty = values.username.length === 0;
    onDisabledChange(isEmpty || isError || isLoading);
  }, [values, onDisabledChange, isError, isLoading]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Organization.headingUsername')}
      </Typography>
      <Typography>{translate('Organization.bodyUsername')}</Typography>
      <Box mt={4}>
        <Input
          errorMessage={errorMessage}
          id="username"
          inputProps={{ maxLength: 24 }}
          isError={isError}
          isLoading={isLoading}
          label={translate('Organization.formUsername')}
          type="text"
          value={values.username}
          onChange={handleChange}
        />
      </Box>
    </Fragment>
  );
};

const OrganizationStepAvatar = ({ values, onDisabledChange, onChange }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputElem = useRef();

  const onUpload = (event) => {
    event.preventDefault();
    fileInputElem.current.click();
  };

  const handleChange = async (event) => {
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

      onChange({
        avatarUrl: result.data.url,
      });
    } catch (error) {
      dispatch(
        notify({
          text: translate('Organization.errorAvatarUpload'),
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
    onDisabledChange(isLoading);
  }, [onDisabledChange, isLoading]);

  return (
    <Fragment>
      <Typography align="center" gutterBottom variant="h2">
        {translate('Organization.headingAvatar')}
      </Typography>
      <Typography>{translate('Organization.bodyAvatar')}</Typography>
      <Box mt={4}>
        <Avatar
          className={classes.avatarUpload}
          src={isLoading ? null : values.avatarUrl}
          onClick={onUpload}
        >
          {isLoading ? <CircularProgress /> : '+'}
        </Avatar>
        <input
          accept={fileTypesStr}
          ref={fileInputElem}
          style={{ display: 'none' }}
          type="file"
          onChange={handleChange}
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

OrganizationStepUsername.propTypes = {
  ...stepProps,
};

OrganizationStepAvatar.propTypes = {
  ...stepProps,
};

export default Organization;
