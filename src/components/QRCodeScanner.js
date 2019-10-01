import PropTypes from 'prop-types';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!qr-scanner/qr-scanner-worker.min.js';
import React, { useEffect, createRef } from 'react';

QrScanner.WORKER_PATH = QrScannerWorkerPath;

const QRCodeScanner = props => {
  const ref = createRef();

  const initializeScanner = () => {
    new QrScanner(ref.current, result => {
      props.onSuccess(result);
    });
  };

  useEffect(initializeScanner, []);

  return <video ref={ref} />;
};

QRCodeScanner.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};

export default QRCodeScanner;
