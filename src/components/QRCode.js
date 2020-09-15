import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useEffect } from 'react';
import { Box, Paper } from '@material-ui/core';

const QR_CODE_SIZE = 230;

const QRCode = (props) => {
  const ref = createRef();

  const generateQRCode = () => {
    const options = {
      margin: 0,
      scale: props.scale || null,
      width: QR_CODE_SIZE,
    };

    QRCodeGenerator.toCanvas(ref.current, props.data, options);
  };

  useEffect(generateQRCode, [props.data]);

  return (
    <Box display="flex" justifyContent="center">
      <Paper>
        <Box component="canvas" m={3} ref={ref} />
      </Paper>
    </Box>
  );
};

QRCode.propTypes = {
  data: PropTypes.string.isRequired,
  scale: PropTypes.number,
};

export default QRCode;
