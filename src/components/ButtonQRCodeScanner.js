import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';

import QRCodeScanner from '~/components/QRCodeScanner';
import { IconScan } from '~/styles/icons';

const ButtonQRCodeScanner = ({ onSelect, ...props }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (address) => {
    setIsScannerOpen(false);
    onSelect(address);
  };

  const handleScannerError = () => {
    setIsScannerOpen(false);
  };

  const handleScannerOpen = () => {
    setIsScannerOpen(true);
  };

  const handleScannerClose = () => {
    setIsScannerOpen(false);
  };

  return (
    <QRCodeScanner
      isOpen={isScannerOpen}
      onClose={handleScannerClose}
      onError={handleScannerError}
      onSuccess={handleScan}
    >
      <IconButton onClick={handleScannerOpen} {...props}>
        <IconScan />
      </IconButton>
    </QRCodeScanner>
  );
};

ButtonQRCodeScanner.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default ButtonQRCodeScanner;
