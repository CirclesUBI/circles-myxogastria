import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
import React, { useState, useEffect, createRef } from 'react';
import { useDispatch } from 'react-redux';

import notify, { NotificationsTypes } from '~/store/notifications/actions';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QRCodeScanner = (props, context) => {
  const dispatch = useDispatch();

  const [isCameraAvailable, setIsCameraAvailable] = useState(true);
  const [isOnlyUpload, setIsOnlyUpload] = useState(false);

  const refVideo = createRef();
  const refInput = createRef();

  const onImageSelected = event => {
    const image = event.target.files[0];

    if (!image) {
      return;
    }

    QrScanner.scanImage(image)
      .then(result => {
        props.onSuccess(result);
      })
      .catch(() => {
        dispatch(
          notify({
            text: context.t('QrCodeScanner.qrNotFound'),
            type: NotificationsTypes.WARNING,
          }),
        );
      });
  };

  const initialize = () => {
    let scanner;

    QrScanner.hasCamera().then(cameraResult => {
      setIsCameraAvailable(cameraResult);

      if (!cameraResult) {
        return;
      }

      try {
        scanner = new QrScanner(refVideo.current, result => {
          props.onSuccess(result);
        });

        scanner.start();
      } catch {
        // .. fall back on manual upload option
        setIsOnlyUpload(true);
      }
    });

    return () => {
      if (!scanner) {
        return;
      }

      scanner.destroy();
    };
  };

  useEffect(initialize, []);

  if (!isCameraAvailable || isOnlyUpload) {
    return (
      <input
        accept="image/*"
        capture="camera"
        ref={refInput}
        type="file"
        onChange={onImageSelected}
      />
    );
  }

  return <video ref={refVideo} />;
};

QRCodeScanner.contextTypes = {
  t: PropTypes.func.isRequired,
};

QRCodeScanner.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
