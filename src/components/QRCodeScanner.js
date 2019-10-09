import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
import React, { Fragment, useState, useEffect, createRef } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import findAddress from '~/utils/findAddress';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QRCodeScanner = (props, context) => {
  const dispatch = useDispatch();

  const [isOnlyUpload, setIsOnlyUpload] = useState(false);

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
    } catch (error) {
      // .. fall back on manual upload option
      setIsOnlyUpload(true);
    }
  };

  const initialize = () => {
    const startCameraStream = async () => {
      const isAvailable = await QrScanner.hasCamera();

      if (!isAvailable) {
        setIsOnlyUpload(true);
      }
    };

    startCameraStream();

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

  // @TODO: Improve UI elements depending on permissions
  return (
    <Fragment>
      <input
        accept="image/*"
        capture="camera"
        ref={refInput}
        style={{ display: 'none' }}
        type="file"
        onChange={onImageSelected}
      />

      <video ref={refVideo} />

      <Button onClick={onClick}>{context.t('QRCodeScanner.tapToScan')}</Button>
    </Fragment>
  );
};

QRCodeScanner.contextTypes = {
  t: PropTypes.func.isRequired,
};

QRCodeScanner.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
