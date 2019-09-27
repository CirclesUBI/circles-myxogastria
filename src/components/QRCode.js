import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useState, useEffect } from 'react';

const QRCode = props => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const ref = createRef();

  const generateQRCode = () => {
    const options = {
      margin: 0,
      scale: props.scale || null,
      width: props.width || null,
    };

    setIsLoading(true);

    QRCodeGenerator.toCanvas(ref.current, props.data, options, () => {
      setIsLoading(false);
    });
  };

  useEffect(generateQRCode, [props.data]);

  return <canvas ref={ref} />;
};

QRCode.propTypes = {
  data: PropTypes.string.isRequired,
  scale: PropTypes.number,
  width: PropTypes.number,
};

export default QRCode;
