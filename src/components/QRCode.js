import { Box, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useEffect } from 'react';

const QR_CODE_SIZE = 230;

const QRCode = ({ children, data, scale, width, ...props }) => {
  const ref = createRef();

  useEffect(() => {
    const options = {
      margin: 0,
      scale: scale || null,
      width: width || QR_CODE_SIZE,
    };

    QRCodeGenerator.toCanvas(ref.current, data, options);
  }, [ref, scale, data, width]);

  return (
    <Box display="flex" justifyContent="center">
      <Paper>
        <Box alignItems="center" display="flex" flexDirection="column" m={3}>
          {children}
          <Box component="canvas" {...props} mt={children ? 3 : 0} ref={ref} />
        </Box>
      </Paper>
    </Box>
  );
};

QRCode.propTypes = {
  children: PropTypes.node,
  data: PropTypes.string.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number,
};

export default React.memo(QRCode);
