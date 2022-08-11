import {
  Badge,
  Box,
  Container,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import mime from 'mime/lite';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import CenteredHeading from '~/components/CenteredHeading';
import DialogInfo from '~/components/DialogInfo';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import UploadFromCamera from '~/components/UploadFromCamera';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import View from '~/components/View';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { IconUploadPhoto } from '~/styles/icons';
import { getDeviceDetect } from '~/utils/deviceDetect';

const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const BOTTOM_SPACING = '30px';

const useStyles = makeStyles((theme) => ({
  uploadButton: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    padding: 0,
  },
  uploadButtonIcon: {
    position: 'relative',
    left: 1,
    width: '2.2em',
    height: '2.2em',
  },
  textContainer: {
    textAlign: 'center',
    '& >p': {
      marginBottom: '8px',
    },
  },
  dialogContentContainer: {
    '& >p': {
      marginBottom: BOTTOM_SPACING,
    },
  },
  continueButton: {
    marginBottom: BOTTOM_SPACING,
  },
  actionButtonsContainer: {
    marginBottom: BOTTOM_SPACING,
  },
  usernameInputContainer: {
    marginBottom: BOTTOM_SPACING,
    marginTop: '50px',
  },
  openCameraInput: {
    display: 'none',
  },
  saveButton: {
    marginBottom: '20px',
  },
}));

const DialogContentUpload = ({ onFileUpload, handleClose, uploadImgSrc }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadFromCamera, setIsUploadFromCamera] = useState(false);
  const fileInputElem = useRef();

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

    uploadPhoto(files);
  };

  async function uploadPhoto(files) {
    setIsLoading(true);

    let data;

    if (files.length) {
      data = [...files].reduce((acc, file) => {
        acc.append('files', file, file.name);
        return acc;
      }, new FormData());
    } else {
      data = new FormData();
      data.append('files', files);
    }

    try {
      const result = await core.utils.requestAPI({
        path: ['uploads', 'avatar'],
        method: 'POST',
        data,
      });

      onFileUpload(result.data.url);
      handleClose();
    } catch (error) {
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
            isWhite
            onClick={galleryBtnHandler}
          >
            {translate('EditProfile.optionFile')}
          </Button>
          <input
            accept={fileTypesStr}
            ref={fileInputElem}
            style={{ display: 'none' }}
            type="file"
            onChange={uploadFile}
          />
        </>
      )}
      {!isUploadFromCamera && (
        <Box className={classes.actionButtonsContainer}>
          <Button fullWidth isOutline isWhite onClick={cameraBtnHandler}>
            {translate('EditProfile.optionCamera')}
          </Button>
        </Box>
      )}
      {isUploadFromCamera && (
        <UploadFromCamera
          imageCaptureError={onImageCaptureErrorHandler}
          isUploading={isLoading}
          uploadImgSrc={uploadImgSrc}
          uploadPhoto={uploadPhoto}
        />
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
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const dispatch = useDispatch();
  const deviceDetect = getDeviceDetect();

  const safe = useSelector((state) => state.safe);
  const { username, avatarUrl } = useUserdata(safe.currentAccount);

  const onChangeUsernameHandler = (username) => {
    setUsernameInput(username);
  };

  const onDisabledChange = (updatedValue) => {
    if (username !== usernameInput) {
      setIsDisabled(updatedValue);
    }
  };

  const saveChangesHandler = async () => {
    editUserData();
  };

  async function editUserData() {
    try {
      const userEmail = await core.user.getEmail(safe.currentAccount);
      const result = await core.user.update(
        safe.currentAccount,
        usernameInput,
        userEmail,
        profilePicUrl,
      );

      if (result) {
        dispatch(
          notify({
            text: translate('EditProfile.confirmationMessage'),
            type: NotificationsTypes.SUCCESS,
          }),
        );
        setIsClose(true);
      }
    } catch (error) {
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

  const dialogContentClose = (
    <Box className={classes.dialogContentContainer}>
      <Typography className="lightGreyText">
        {translate('EditProfile.bodyCancel')}
      </Typography>
      <Button
        className={classes.continueButton}
        fullWidth
        isPrimary
        onClick={() => setIsOpenDialogCloseInfo(false)}
      >
        {translate('EditProfile.buttonContinue')}
      </Button>
      <Button fullWidth isOutline isWhite onClick={dialogCloseInfoHandler}>
        {translate('EditProfile.buttonCancel')}
      </Button>
    </Box>
  );

  if (isClose) {
    return <Redirect to={DASHBOARD_PATH} />;
  }

  return (
    <>
      <Header>
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
          {/* <label htmlFor="cameraFileInput">
            <span className="btn">Open camera</span>
            <input
              accept="image/*"
              capture="environment"
              className={classes.openCameraInput}
              id="cameraFileInput"
              type="file"
            />
          </label> */}
          <Box align="center" mb={2} mt={4}>
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton className={classes.uploadButton}>
                  <IconUploadPhoto className={classes.uploadButtonIcon} />
                </IconButton>
              }
              overlap="circular"
              onClick={() => setIsOpenDialogUploadInfo(true)}
            >
              <Avatar
                address={safe.currentAccount || safe.pendingAddress}
                size="large"
                url={profilePicUrl}
              />
            </Badge>
          </Box>
          <Box className={classes.usernameInputContainer}>
            <VerifiedUsernameInput
              label={translate('Onboarding.formUsername')}
              value={usernameInput}
              onChange={onChangeUsernameHandler}
              onStatusChange={onDisabledChange}
            />
          </Box>
          <Box className={classes.textContainer} mb={3} mt={6}>
            <Typography className="lightGreyText">
              {translate('EditProfile.usernameExplanation')}
            </Typography>
            <Typography className="lightGreyText">
              {translate('EditProfile.charactersExplanation')}
            </Typography>
          </Box>
        </Container>
      </View>
      <Footer>
        <Button
          className={classes.saveButton}
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={saveChangesHandler}
        >
          {translate('EditProfile.buttonSave')}
        </Button>
        <Button fullWidth isOutline isWhite onClick={dialogOpenInfoHandler}>
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
