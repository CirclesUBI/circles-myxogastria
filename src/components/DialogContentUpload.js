import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import mime from 'mime/lite';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import UploadFromCamera from '~/components/UploadFromCamera';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import compressImage from '~/utils/compressImage';
import logError from '~/utils/debug';
import { getDeviceDetect } from '~/utils/deviceDetect';

const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];
const SPACING = '30px';

const useStyles = makeStyles(() => ({
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
}));

const DialogContentUpload = ({
  avatarUploadUrl,
  handleClose,
  handleUpload,
  setNewAvatarUrl,
}) => {
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
      // before setting new URL - delete old one (replacing Upload)
      const result = await core.avatar.upload(data);
      if (avatarUploadUrl && result) {
        await core.avatar.delete(avatarUploadUrl);
      }
      setNewAvatarUrl(result.data.url);
      handleUpload();
      handleClose();
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('AvatarUploader.errorAvatarUpload')}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    setIsLoading(false);
  }

  const onImageCaptureErrorHandler = () => {
    dispatch(
      notify({
        text: (
          <Typography classes={{ root: 'body4_white' }} variant="body4">
            {translate('EditProfile.errorImageCapture')}
          </Typography>
        ),
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
          uploadImgSrc={setNewAvatarUrl}
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

DialogContentUpload.propTypes = {
  avatarUploadUrl: PropTypes.string,
  handleClose: PropTypes.func,
  handleUpload: PropTypes.func,
  setNewAvatarUrl: PropTypes.func.isRequired,
};

export default DialogContentUpload;
