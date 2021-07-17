import { Backdrop, Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

let scanner;

const fixedStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  pointerEvents: 'none',
};

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.qrCodeScannerBackdrop,
  },
  videoContainer: {
    ...fixedStyle,
    zIndex: theme.zIndex.qrCodeScannerVideo,
  },
  video: {
    width: theme.spacing(80),
    height: theme.spacing(80),
    maxWidth: '100%',
  },
  spinner: {
    ...fixedStyle,
    zIndex: theme.zIndex.qrCodeScannerSpinner,
  },
}));

const QRCodeScanner = ({ children, isOpen, onClose, onSuccess, onError }) => {
  const classes = useStyles();

  return (
    <Box>
      <Backdrop className={classes.backdrop} open={isOpen} onClick={onClose}>
        {isOpen && (
          <QRCodeScannerInner onError={onError} onSuccess={onSuccess} />
        )}
      </Backdrop>
      {children}
    </Box>
  );
};

const QRCodeScannerInner = ({ onSuccess, onError }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isError, setIsError] = useState(false);

  const handleDetection = (result) => {
    const match = core.utils.matchAddress(result);
    if (match) {
      onSuccess(match);
    }
  };

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        scanner = new BrowserMultiFormatReader();

        const devices = await scanner.getVideoInputDevices();
        if (devices.length === 0) {
          throw new Error('No devices found');
        }

        if (!ref.current) {
          return;
        }

        scanner.decodeFromVideoDevice(
          undefined,
          ref.current,
          (result, error) => {
            if (result) {
              handleDetection(result.text);
            }

            if (error && !(error instanceof NotFoundException)) {
              throw error;
            }
          },
        );
      } catch (error) {
        dispatch(
          notify({
            text: translate('QRCodeScanner.notificationError', {
              error: error.message || 'Undefined error',
            }),
            type: NotificationsTypes.ERROR,
          }),
        );

        setIsError(true);

        if (onError) {
          onError(error);
        }
      }
    };

    initializeScanner();

    return () => {
      if (scanner) {
        scanner.reset();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return !isError ? (
    <Fragment>
      <Box className={classes.videoContainer}>
        <video className={classes.video} ref={ref} />
      </Box>
      <Box className={classes.spinner}>
        <CircularProgress />
      </Box>
    </Fragment>
  ) : null;
};

QRCodeScanner.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

QRCodeScannerInner.propTypes = {
  onError: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
