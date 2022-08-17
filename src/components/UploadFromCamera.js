import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';

import Button from '~/components/Button';
import ImageCapture from '~/components/ImageCapture';
import translate from '~/services/locale';

const BOTTOM_SPACING = '25px';

const useStyles = makeStyles((theme) => ({
  uploadFromCameraContainer: {},
  cameraContainer: {
    maxWidth: '350px',
    margin: '0 auto',

    [theme.breakpoints.up('sm')]: {
      height: '400px',
    },
  },
  imageContainer: {
    maxWidth: '350px',
    margin: `0 auto ${BOTTOM_SPACING}`,
    clipPath: 'circle(99px at center)',
    height: '198px',
    '& img': {
      display: 'block',
    },
    [theme.breakpoints.up('sm')]: {
      clipPath: 'circle(130px at center)',
      minHeight: '263px',
    },
    overflow: 'hidden',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  tryAgainBtn: {
    marginBottom: BOTTOM_SPACING,
  },
  btnContainer: {
    maxWidth: '350px',
    minHeight: '112px',
    margin: '0 auto',
  },
  loadingMask: {
    background: theme.custom.colors.cornflowerBlue,
    opacity: 0.5,
    position: 'relative',
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
        <>
          <Box className={classes.cameraContainer}>
            <ImageCapture
              userMediaConfig={config}
              width={'100%'}
              onCapture={onCapture}
              onError={onError}
            />
          </Box>
        </>
      )}
      {!showImgCapture && (
        <Box className={classes.imageContainer}>
          {isUploading && (
            <Box className={clsx(classes.imageContainer, classes.loadingMask)}>
              <Box className={classes.loadingIndicator}>
                <CircularProgress />
              </Box>
            </Box>
          )}
          <img alt="screenshot" src={imgSrc} />
        </Box>
      )}
      {imgSrc && !showImgCapture && (
        <Box className={classes.btnContainer}>
          <Button
            className={classes.tryAgainBtn}
            fullWidth
            isWithoutBorder
            onClick={resetPhoto}
          >
            {translate('EditProfile.optionTryAgain')}
          </Button>
          <Button fullWidth isOutline isPrimary onClick={btnUploadHandler}>
            {translate('EditProfile.optionUpload')}
          </Button>
        </Box>
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
