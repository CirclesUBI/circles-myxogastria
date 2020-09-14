import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
import React, { useState, useEffect, createRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import findAddress from '~/utils/findAddress';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
import translate from '~/services/locale';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QRCodeScanner = (props) => {
  const dispatch = useDispatch();

  const [isOnlyUpload, setIsOnlyUpload] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  const refVideo = createRef();
  const refInput = createRef();

  let scanner;

  const onImageSelected = async (event) => {
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
          text: translate('QRCodeScanner.qrNotFound'),
          type: NotificationsTypes.WARNING,
        }),
      );
    }
  };

  const startCameraStream = async () => {
    try {
      scanner = new QrScanner(refVideo.current, (result) => {
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
    <QRCodeScannerStyle isVideoVisible={isVideoVisible}>
      <input
        accept="image/*"
        capture="camera"
        ref={refInput}
        style={{ display: 'none' }}
        type="file"
        onChange={onImageSelected}
      />

      <QRCodeScannerVideoStyle
        isVideoVisible={isVideoVisible}
        muted
        playsinline
        ref={refVideo}
      />

      <Button isVideoVisible={isVideoVisible} onClick={onClick}>
        <span>{translate('QRCodeScanner.tapToScan')}</span>
      </Button>
    </QRCodeScannerStyle>
  );
};

QRCodeScanner.propTypes = {
  disabled: PropTypes.bool,
  onSuccess: PropTypes.func.isRequired,
};

const QRCodeScannerStyle = styled.div`
  display: flex;

  overflow: hidden;

  width: 28rem;
  height: 28rem;

  margin: ${(props) => {
    return props.isVideoVisible ? '2rem auto' : '2rem auto';
  }};

  border-radius: 25px;

  background-color: ${(props) => {
    return props.isVideoVisible ? 'transparent' : styles.monochrome.grayLighter;
  }};

  box-shadow: 0 2px 2px ${styles.monochrome.gray};

  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const QRCodeScannerVideoStyle = styled.video`
  display: ${(props) => {
    return props.isVideoVisible ? 'block' : 'none';
  }};
`;

export default QRCodeScanner;
