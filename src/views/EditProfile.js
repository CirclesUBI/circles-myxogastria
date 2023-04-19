import { Box, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import mime from 'mime/lite';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import CheckboxPrivacy from '~/components/CheckboxPrivacy';
import CheckboxTerms from '~/components/CheckboxTerms';
import DialogInfo from '~/components/DialogInfo';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import UploadFromCamera from '~/components/UploadFromCamera';
import VerifiedEmailInput from '~/components/VerifiedEmailInput';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import View from '~/components/View';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import compressImage from '~/utils/compressImage';
import logError from '~/utils/debug';
import { getDeviceDetect } from '~/utils/deviceDetect';

const SPACING = '30px';
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const useStyles = makeStyles((theme) => ({
  avatarHl: {
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
  textContainer: {
    textAlign: 'center',
    '& >p': {
      marginBottom: '8px',
    },
  },
  dialogContentContainer: {
    '& >p': {
      marginBottom: SPACING,
    },
  },
  continueButton: {
    marginBottom: SPACING,
  },
  actionButtonsContainer: {
    marginBottom: SPACING,
  },
  usernameInputContainer: {
    marginBottom: SPACING,
    marginTop: '50px',
  },
  openCameraInput: {
    display: 'none',
  },
  saveButton: {
    marginBottom: '20px',
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
}));

const DialogContentUpload = ({ onFileUpload, handleClose, uploadImgSrc }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadFromCamera, setIsUploadFromCamera] = useState(false);
  const fileInputElem = useRef();
  const fileInputElemMob = useRef();
  const deviceDetect = getDeviceDetect();
  const isDesktop = deviceDetect.isDesktop();

  const galleryBtnMobileHandler = () => {
    fileInputElemMob.current.click();
  };

  const galleryBtnHandler = (event) => {
    event.preventDefault();
    fileInputElem.current.click();
    setIsUploadFromCamera(false);
  };

  const cameraBtnHandler = () => {
    setIsUploadFromCamera(true);
  };

  const uploadFile = async (event) => {
    const { files } = event.target;
    if (files.length === 0) {
      return;
    }

    uploadPhoto([...files]);
  };

  async function uploadPhoto(files) {
    setIsLoading(true);

    try {
      let data;
      let optimiseFiles = await compressImage(files);

      if (optimiseFiles.length) {
        data = [...optimiseFiles].reduce((acc, file) => {
          acc.append('files', file, file.name);
          return acc;
        }, new FormData());
      } else {
        data = new FormData();
        data.append('files', optimiseFiles);
      }

      const result = await core.utils.requestAPI({
        path: ['uploads', 'avatar'],
        method: 'POST',
        data,
      });

      onFileUpload(result.data.url);
      handleClose();
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: translate('AvatarUploader.errorAvatarUpload'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    setIsLoading(false);
  }

  const onImageCaptureErrorHandler = () => {
    dispatch(
      notify({
        text: translate('EditProfile.errorImageCapture'),
        type: NotificationsTypes.ERROR,
      }),
    );
  };

  const fileTypesStr = IMAGE_FILE_TYPES.map((ext) => {
    return mime.getType(ext);
  }).join(',');

  return (
    <Box className={classes.dialogContentContainer}>
      {!isUploadFromCamera && (
        <>
          <Button
            className={classes.continueButton}
            fullWidth
            isOutline
            onClick={galleryBtnMobileHandler}
          >
            {translate('EditProfile.optionFile')}
          </Button>
          <input
            accept={fileTypesStr}
            ref={fileInputElemMob}
            style={{ display: 'none' }}
            type="file"
            onChange={uploadFile}
          />
        </>
      )}
      {!isUploadFromCamera && isDesktop && (
        <Box className={classes.actionButtonsContainer}>
          <Button fullWidth isOutline onClick={cameraBtnHandler}>
            {translate('EditProfile.optionCamera')}
          </Button>
        </Box>
      )}
      {isUploadFromCamera && isDesktop && (
        <UploadFromCamera
          imageCaptureError={onImageCaptureErrorHandler}
          isUploading={isLoading}
          uploadImgSrc={uploadImgSrc}
          uploadPhoto={uploadPhoto}
        />
      )}
      {!isDesktop && (
        <>
          <Button
            className={classes.continueButton}
            fullWidth
            isOutline
            onClick={galleryBtnHandler}
          >
            {translate('EditProfile.optionCamera')}
          </Button>
          <input
            accept="image/*"
            capture="environment"
            ref={fileInputElem}
            style={{ display: 'none' }}
            type="file"
            onChange={uploadFile}
          />
        </>
      )}
    </Box>
  );
};

const EditProfile = () => {
  const classes = useStyles();
  const [isClose, setIsClose] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenDialogCloseInfo, setIsOpenDialogCloseInfo] = useState(false);
  const [isOpenDialogUploadInfo, setIsOpenDialogUploadInfo] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const [usernameValid, setUsernameValid] = useState();
  const [emailInput, setEmailInput] = useState();
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const [isConsentInfo, setIsConsentInfo] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
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
    try {
      const result = await core.user.update(
        safe.currentAccount,
        usernameInput,
        emailInput,
        profilePicUrl,
      );

      if (result) {
        setUseCacheOnRedirect(false);
        dispatch(
          notify({
            text: translate('EditProfile.confirmationMessage'),
            type: NotificationsTypes.SUCCESS,
          }),
        );
        setIsClose(true);
      }
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: translate('EditProfile.errorSaveChanges'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }

  const dialogOpenInfoHandler = () => {
    setIsOpenDialogCloseInfo(true);
  };

  const dialogCloseInfoHandler = () => {
    setIsClose(true);
  };

  const onFileUploadHandler = (updatedValue) => {
    setProfilePicUrl(updatedValue);
  };

  const uploadImgSrcHandler = (updatedValue) => {
    setProfilePicUrl(updatedValue);
  };

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

  const dialogContentClose = (
    <Box className={classes.dialogContentContainer}>
      <Typography className="lightGreyText">
        {translate('EditProfile.bodyCancel')}
      </Typography>
      <Button
        className={classes.continueButton}
        fullWidth
        onClick={() => setIsOpenDialogCloseInfo(false)}
      >
        {translate('EditProfile.buttonContinue')}
      </Button>
      <Button fullWidth isText onClick={dialogCloseInfoHandler}>
        {translate('EditProfile.buttonCancel')}
      </Button>
    </Box>
  );

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
        <ButtonBack />
        <CenteredHeading>{translate('EditProfile.heading')}</CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <DialogInfo
            dialogContent={dialogContentClose}
            fullWidth
            handleClose={() => setIsOpenDialogCloseInfo(false)}
            isBtnClose={false}
            isOpen={isOpenDialogCloseInfo}
            maxWidth={'xs'}
            title={translate('EditProfile.titleCancel')}
          />
          <DialogInfo
            className={classes.dialogUploadContainer}
            dialogContent={
              <DialogContentUpload
                handleClose={() => setIsOpenDialogUploadInfo(false)}
                uploadImgSrc={uploadImgSrcHandler}
                onFileUpload={onFileUploadHandler}
              />
            }
            fullWidth
            handleClose={() => setIsOpenDialogUploadInfo(false)}
            isOpen={isOpenDialogUploadInfo}
            maxWidth={'xs'}
          />
          <Box align="center" mb={2} mt={4}>
            <Box
              className={classes.avatarHl}
              onClick={() => setIsOpenDialogUploadInfo(true)}
            >
              <Avatar
                address={safe.currentAccount || safe.pendingAddress}
                size="large"
                url={profilePicUrl}
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
                <Typography className="lightGreyText">
                  {informationText}
                </Typography>
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
        <Button
          className={classes.saveButton}
          disabled={isDisabled}
          fullWidth
          onClick={saveChangesHandler}
        >
          {translate('EditProfile.buttonSave')}
        </Button>
        <Button fullWidth isText onClick={dialogOpenInfoHandler}>
          {translate('EditProfile.buttonCancel')}
        </Button>
      </Footer>
    </>
  );
};

DialogContentUpload.propTypes = {
  handleClose: PropTypes.func,
  onFileUpload: PropTypes.func.isRequired,
  uploadImgSrc: PropTypes.func,
};

export default EditProfile;
