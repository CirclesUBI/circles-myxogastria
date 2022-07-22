import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useEffect, useRef } from 'react';
import { createRef, useCallback } from 'react';

import Button from '~/components/Button';
import translate from '~/services/locale';

const useStyles = makeStyles((theme) => ({
  videoContainer: {
    marginBottom: '25px',
    height: '198px',
    [theme.breakpoints.up('sm')]: {
      minHeight: '263px',
    },
  },
  imageCanvas: {
    display: 'none',
  },
}));

const ImageCapture = ({ onCapture, onError, width, userMediaConfig }) => {
  const classes = useStyles();

  const playerRef = createRef();
  const canvasRef = createRef();
  const tracks = useRef();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(userMediaConfig)
      .then((stream) => {
        if (playerRef.current) {
          playerRef.current.srcObject = stream;
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
          file: new File([pngData], `${new Date().getTime()}.png`),
        });
      });
    }
  }, [onCapture, canvasRef, playerRef]);

  return (
    <>
      <Box className={classes.videoContainer}>
        <video autoPlay playsInline ref={playerRef} width={width}></video>
      </Box>
      <Box>
        <Button fullWidth isPrimary onClick={captureImage}>
          {translate('EditProfile.optionCapture')}
        </Button>
        <canvas className={classes.imageCanvas} ref={canvasRef} />
      </Box>
    </>
  );
};

ImageCapture.propTypes = {
  onCapture: PropTypes.func,
  onError: PropTypes.func,
  userMediaConfig: PropTypes.object,
  width: PropTypes.string,
};

export default ImageCapture;
