import { Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { createRef, useCallback } from 'react';

import Button from '~/components/Button';
import translate from '~/services/locale';

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    marginBottom: '25px',
    height: '198px',
    clipPath: 'circle(99px at center)',
    [theme.breakpoints.up('sm')]: {
      minHeight: '263px',
      clipPath: 'circle(130px at center)',
    },
    overflow: 'hidden',
  },
  imageCanvas: {
    display: 'none',
  },
  loadingMask: {
    background: theme.custom.colors.purple600,
    opacity: 0.5,
    position: 'relative',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  imageCaptureContainer: {
    position: 'relative',

    [theme.breakpoints.up('sm')]: {
      minHeight: '400px',
    },
  },
  captureBtn: {
    marginBottom: '25px',
  },
}));

const ImageCapture = ({ onCapture, onError, width, userMediaConfig }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);

  const playerRef = createRef();
  const canvasRef = createRef();
  const tracks = useRef();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(userMediaConfig)
      .then((stream) => {
        if (playerRef.current) {
          playerRef.current.srcObject = stream;
          setIsLoading(false);
        }
        tracks.current = stream.getTracks();
      })
      .catch((error) => {
        if (onError) onError(error);
      });
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [onError, userMediaConfig]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    return () => {
      if (tracks.current) {
        tracks.current.forEach((track) => track.stop());
      }
    };
  }, []);

  const captureImage = useCallback(() => {
    const imageWidth = playerRef.current.offsetWidth;
    const imageHeight = playerRef.current.offsetHeight;
    [canvasRef.current.width, canvasRef.current.height] = [
      imageWidth,
      imageHeight,
    ];
    const context = canvasRef.current.getContext('2d');
    context.drawImage(playerRef.current, 0, 0, imageWidth, imageHeight);
    if (onCapture) {
      const pngData = canvasRef.current.toDataURL();
      canvasRef.current.toBlob((blob) => {
        onCapture({
          blob,
          png: pngData,
          file: [
            new File([blob], `${new Date().getTime()}.png`, {
              type: 'image/png',
            }),
          ],
        });
      });
    }
  }, [onCapture, canvasRef, playerRef]);

  return (
    <Box className={classes.imageCaptureContainer}>
      <Box className={classes.videoContainer}>
        {isLoading && (
          <Box className={clsx(classes.videoContainer, classes.loadingMask)}>
            <Box className={classes.loadingIndicator}>
              <CircularProgress />
            </Box>
          </Box>
        )}
        <video autoPlay playsInline ref={playerRef} width={width}></video>
      </Box>
      <canvas className={classes.imageCanvas} ref={canvasRef} />
      <Button
        className={classes.captureBtn}
        disabled={isLoading}
        fullWidth
        onClick={captureImage}
      >
        {translate('EditProfile.optionCapture')}
      </Button>
      <Button disabled={true} fullWidth isText>
        {translate('EditProfile.optionUpload')}
      </Button>
    </Box>
  );
};

ImageCapture.propTypes = {
  onCapture: PropTypes.func,
  onError: PropTypes.func,
  userMediaConfig: PropTypes.object,
  width: PropTypes.string,
};

export default ImageCapture;
