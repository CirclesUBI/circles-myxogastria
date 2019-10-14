import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
import React, { useState, useEffect, createRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import ButtonStyle from '~/components/Button';
import findAddress from '~/utils/findAddress';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QRCodeScanner = (props, context) => {
  const dispatch = useDispatch();

  const [isOnlyUpload, setIsOnlyUpload] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const refVideo = createRef();
  const refInput = createRef();

  let scanner;

  const onImageSelected = async event => {
    const image = event.target.files[0];

    if (!image) {
      return;
    }

    try {
      const result = await QrScanner.scanImage(image);
      const address = findAddress(result);

      props.onSuccess(address);
    } catch {
      dispatch(
        notify({
          text: context.t('QRCodeScanner.qrNotFound'),
          type: NotificationsTypes.WARNING,
        }),
      );
    }
  };

  const startCameraStream = async () => {
    try {
      scanner = new QrScanner(refVideo.current, result => {
        const address = findAddress(result);
        props.onSuccess(address);
      });

      await scanner.start();

      setIsVideoVisible(true);
    } catch (error) {
      // .. fall back on manual upload option
      setIsOnlyUpload(true);
    }
  };

  const initialize = () => {
    const checkCamera = async () => {
      // @TODO: Find a better way to check if we have the permission to use camera
      const isAvailable = await QrScanner.hasCamera();

      if (!isAvailable) {
        setIsOnlyUpload(true);
      }
    };

    checkCamera();

    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  };

  const onClick = () => {
    if (isOnlyUpload) {
      refInput.current.click();
    } else {
      startCameraStream();
    }
  };

  useEffect(initialize, []);

  return (
    <QRCodeScannerStyle>
      <input
        accept="image/*"
        capture="camera"
        ref={refInput}
        style={{ display: 'none' }}
        type="file"
        onChange={onImageSelected}
      />

      <QRCodeScannerVideoStyle
        ref={refVideo}
        style={{ display: isVideoVisible ? 'block' : 'none' }}
      />

      <QRCodeScannerButtonStyle
        disabled={props.disabled || false}
        style={{ display: isVideoVisible ? 'none' : 'inline-block' }}
        onClick={onClick}
      >
        {context.t('QRCodeScanner.tapToScan')}
      </QRCodeScannerButtonStyle>
    </QRCodeScannerStyle>
  );
};

QRCodeScanner.contextTypes = {
  t: PropTypes.func.isRequired,
};

QRCodeScanner.propTypes = {
  disabled: PropTypes.bool,
  onSuccess: PropTypes.func.isRequired,
};

const QRCodeScannerStyle = styled.div`
  display: flex;

  width: 30rem;
  height: 30rem;

  margin: 0 auto;

  background-color: ${styles.colors.secondary};

  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const QRCodeScannerVideoStyle = styled.video`
  width: 100%;
  height: 100%;
`;

const QRCodeScannerButtonStyle = styled(ButtonStyle)``;

export default QRCodeScanner;
