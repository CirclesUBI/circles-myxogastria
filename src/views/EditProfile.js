import { Box, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonDeleteProfile from '~/components/ButtonDeleteProfile';
import CenteredHeading from '~/components/CenteredHeading';
import CheckboxPrivacy from '~/components/CheckboxPrivacy';
import CheckboxTerms from '~/components/CheckboxTerms';
import Dialog from '~/components/Dialog';
import DialogAvatarUpload from '~/components/DialogAvatarUpload';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import View from '~/components/View';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import logError from '~/utils/debug';

const SPACING = '30px';

const useStyles = makeStyles((theme) => ({
  avatarHl: {
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
  dialogContentContainer: {
    '& >p': {
      marginBottom: SPACING,
    },
  },
  continueButton: {
    marginBottom: SPACING,
  },
  usernameInputContainer: {
    marginBottom: SPACING,
    marginTop: '50px',
  },
  buttonsEdit: {
    marginTop: '8px',
    marginBottom: '8px',
  },
  informationContainer: {
    maxWidth: '350px',
    margin: `${SPACING} 42px ${SPACING}`,
    [theme.breakpoints.up('sm')]: {
      margin: `${SPACING} auto ${SPACING}`,
    },
  },
  informationText: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  emailInputContainer: {
    position: 'relative',
    zIndex: theme.zIndex.layer1,
  },
  ButtonDeleteProfile: {
    position: 'relative',
    marginBottom: '8px',
    marginTop: '5px',
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [isClose, setIsClose] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenDialogCancelInfo, setIsOpenDialogCancelInfo] = useState(false);
  const [isOpenDialogUploadInfo, setIsOpenDialogUploadInfo] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const [usernameValid, setUsernameValid] = useState();
  const [emailInput, setEmailInput] = useState();
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const [isConsentInfo, setIsConsentInfo] = useState(false);
  const [avatarUploadUrl, setAvatarUploadUrl] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [privacy, setPrivacy] = useState(true);
  const [terms, setTerms] = useState(true);

  const [informationText, setInformationText] = useState(
    translate('EditProfile.informationText'),
  );
  const [useCacheOnRedirect, setUseCacheOnRedirect] = useState(true);
  const dispatch = useDispatch();

  const safe = useSelector((state) => state.safe);
  const isOrganization = safe?.isOrganization;
  const { username } = useUserdata(safe.currentAccount);

  const handleCancel = async () => {
    setIsClose(true);
    if (avatarUploadUrl !== '') {
      await core.avatar.delete(avatarUploadUrl);
      setAvatarUploadUrl('');
    }
  };

  const onChangeUsernameHandler = (username) => {
    setUsernameInput(username);
  };

  const onDisabledChange = useCallback((updatedValue) => {
    setIsDisabled(updatedValue);
  }, []);

  const onUsernameStatusChange = (updatedValue) => {
    if (username !== usernameInput) {
      // Username status returns FALSE when valid
      setUsernameValid(!updatedValue);
    } else {
      setUsernameValid(true);
    }
  };

  const saveChangesHandler = async () => {
    editUserData();
  };

  async function editUserData() {
    const userResult = await core.user.resolve([safe.currentAccount]);
    const oldAvatarUrl = userResult.data.length && userResult.data[0].avatarUrl;

    try {
      const updateResult = await core.user.update(
        safe.currentAccount,
        usernameInput,
        emailInput,
        avatarUploadUrl,
      );

      if (updateResult) {
        setUseCacheOnRedirect(false);
        dispatch(
          notify({
            text: (
              <Typography classes={{ root: 'body4_white' }} variant="body4">
                {translate('EditProfile.confirmationMessage')}
              </Typography>
            ),
            type: NotificationsTypes.SUCCESS,
          }),
        );
        /* eslint-disable no-console */
        setIsClose(true);
      }
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('EditProfile.errorSaveChanges')}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
    // After replacing an avatar the old avatar has to be deleted from AWS
    if (oldAvatarUrl && avatarUploadUrl && avatarUploadUrl !== oldAvatarUrl) {
      try {
        await core.avatar.delete(oldAvatarUrl);
      } catch (error) {
        // No need to notify user
        logError(error);
      }
    }
  }

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  const handleEmailStatus = (status) => {
    // Email status returns FALSE when valid
    setEmailValid(!status);
  };

  const handleEmail = (email) => {
    setEmailInput(email);
    if (email !== currentUserEmail) {
      setIsConsentInfo(true);
      setPrivacy(false);
      setTerms(false);
    } else {
      setIsConsentInfo(false);
      setPrivacy(true);
      setTerms(true);
    }
  };

  const handlePrivacy = ({ target: { checked } }) => {
    setPrivacy(checked);
  };

  const handleTerms = ({ target: { checked } }) => {
    setTerms(checked);
  };

  const onUsernameInputFocusHandler = () => {
    setInformationText(translate('EditProfile.informationText2'));
  };
  const onUsernameInputBlurHandler = () => {
    setInformationText(translate('EditProfile.informationText'));
  };

  const onEmailInputBlurHandler = () => {
    if (emailInput === currentUserEmail) {
      setInformationText(translate('EditProfile.informationText'));
    }
  };

  const onEmailInputFocusHandler = () => {
    setInformationText(translate('EditProfile.informationText3'));
  };

  useEffect(() => {
    onDisabledChange(
      ![emailValid, privacy, terms, usernameValid].every((b) => b === true),
    );
  }, [emailValid, privacy, terms, usernameValid, onDisabledChange]);

  useEffect(() => {
    (async () => {
      const userEmail = (await core.user.getEmail(safe.currentAccount)) || '';
      setEmailInput(userEmail);
      setCurrentUserEmail(userEmail);
    })();
  }, [safe.currentAccount]);

  if (isClose) {
    return (
      <Redirect
        to={{
          pathname: DASHBOARD_PATH,
          state: { useCache: useCacheOnRedirect },
        }}
      />
    );
  }

  return (
    <>
      <Header>
        <CenteredHeading>{translate('EditProfile.heading')}</CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Dialog
            cancelLabel={translate('EditProfile.buttonCancel')}
            confirmLabel={translate('EditProfile.buttonContinue')}
            id={'cancelEditProfile'}
            open={isOpenDialogCancelInfo}
            text={translate('EditProfile.bodyCancel')}
            title={translate('EditProfile.titleCancel')}
            onClose={handleCancel}
            onConfirm={() => setIsOpenDialogCancelInfo(false)}
          />
          <DialogAvatarUpload
            avatarUploadUrl={avatarUploadUrl}
            handleClose={() => setIsOpenDialogUploadInfo(false)}
            isOpen={isOpenDialogUploadInfo}
            setAvatarUploadUrl={setAvatarUploadUrl}
          />
          <Box align="center" mb={2} mt={4}>
            <Box
              className={classes.avatarHl}
              onClick={() => setIsOpenDialogUploadInfo(true)}
            >
              <Avatar
                address={safe.currentAccount || safe.pendingAddress}
                size="large"
                url={avatarUploadUrl}
                withClickEffect={isOpenDialogUploadInfo}
                withHoverEffect
              />
            </Box>
          </Box>
          <Box className={classes.usernameInputContainer}>
            <VerifiedUsernameInput
              address={safe.currentAccount || safe.pendingAddress}
              allowCurrentUser
              isOrganization={isOrganization}
              label={translate('Onboarding.formUsername')}
              value={usernameInput}
              onBlur={onUsernameInputBlurHandler}
              onChange={onChangeUsernameHandler}
              onFocus={onUsernameInputFocusHandler}
              onStatusChange={onUsernameStatusChange}
            />
          </Box>
          <Box className={classes.emailInputContainer}>
            <VerifiedEmailInput
              isOrganization={isOrganization}
              label={translate('Onboarding.formEmail')}
              value={emailInput}
              onBlur={onEmailInputBlurHandler}
              onChange={handleEmail}
              onFocus={onEmailInputFocusHandler}
              onStatusChange={handleEmailStatus}
            />
            <Box className={classes.informationContainer}>
              <Box className={classes.informationText}>
                <Typography>{informationText}</Typography>
              </Box>
              {isConsentInfo && (
                <>
                  <Box>
                    <CheckboxPrivacy
                      checked={privacy}
                      onChange={handlePrivacy}
                    />
                  </Box>
                  <Box>
                    <CheckboxTerms checked={terms} onChange={handleTerms} />
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </View>
      <Footer>
        <ButtonDeleteProfile className={classes.ButtonDeleteProfile} isText />
        <Button
          className={classes.buttonsEdit}
          disabled={isDisabled}
          fullWidth
          onClick={saveChangesHandler}
        >
          {translate('EditProfile.buttonSave')}
        </Button>
        <Button
          fullWidth
          isOutline
          onClick={() => setIsOpenDialogCancelInfo(true)}
        >
          {translate('EditProfile.buttonCancel')}
        </Button>
      </Footer>
    </>
  );
};

export default EditProfile;
