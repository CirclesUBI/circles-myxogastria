import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';

import Button from '~/components/Button';
import ImageCapture from '~/components/ImageCapture';
import translate from '~/services/locale';

const BOTTOM_SPACING = '25px';

const useStyles = makeStyles((theme) => ({
  uploadFromCameraContainer: {},
  cameraContainer: {
    marginBottom: BOTTOM_SPACING,
    maxWidth: '350px',
    height: '272px',

    [theme.breakpoints.up('sm')]: {
      height: '337px',
    },
  },
  imageContainer: {
    marginBottom: BOTTOM_SPACING,
  },
  resetBtn: {
    marginBottom: BOTTOM_SPACING,
  },
}));

const UploadFromCamera = ({
  uploadPhoto,
  imageCaptureError,
  isUploading,
  uploadImgSrc,
}) => {
  const classes = useStyles();

  const [showImgCapture, setShowImgCapture] = useState(true);
  const config = useMemo(() => ({ video: { facingMode: 'user' } }), []);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const onCapture = (imageData) => {
    setImgSrc(imageData.png);
    setImgFile(imageData.file);
    setShowImgCapture(false);
  };
  const onError = useCallback(
    (error) => {
      imageCaptureError();
      throw error;
    },
    [imageCaptureError],
  );

  const btnUploadHandler = () => {
    uploadPhoto(imgFile);
    uploadImgSrc(imgSrc);
  };

  const resetPhoto = () => {
    setShowImgCapture(true);
  };

  return (
    <Box className={classes.uploadFromCameraContainer}>
      {showImgCapture && (
        <Box className={classes.cameraContainer}>
          <ImageCapture
            userMediaConfig={config}
            width={'100%'}
            onCapture={onCapture}
            onError={onError}
          />
        </Box>
      )}
      {!showImgCapture && (
        <Box className={classes.imageContainer}>
          <img alt="screenshot" src={imgSrc} />
        </Box>
      )}
      {imgSrc && !showImgCapture && (
        <>
          <Button
            className={classes.resetBtn}
            fullWidth
            isOutline
            isWhite
            onClick={resetPhoto}
          >
            {translate('EditProfile.optionReset')}
          </Button>
          {!isUploading && (
            <Button fullWidth isOutline isPrimary onClick={btnUploadHandler}>
              {translate('EditProfile.optionUpload')}
            </Button>
          )}
          {isUploading && <CircularProgress />}
        </>
      )}
    </Box>
  );
};

UploadFromCamera.propTypes = {
  imageCaptureError: PropTypes.func,
  isUploading: PropTypes.bool,
  uploadImgSrc: PropTypes.func,
  uploadPhoto: PropTypes.func,
};

export default UploadFromCamera;
