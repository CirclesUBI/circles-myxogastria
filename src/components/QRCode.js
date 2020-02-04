import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useEffect } from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const QR_CODE_SIZE = 250;

const QRCode = props => {
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
    <QRCodeStyle>
      <canvas ref={ref} />
    </QRCodeStyle>
  );
};

QRCode.propTypes = {
  data: PropTypes.string.isRequired,
  scale: PropTypes.number,
};

const QRCodeStyle = styled.div`
  display: flex;

  width: 30rem;
  height: 30rem;

  margin: 0 auto;

  border-radius: 25px;

  background-color: ${styles.monochrome.white};

  box-shadow: 0 2px 2px ${styles.monochrome.grayLight};

  align-items: center;
  justify-content: center;
`;

export default QRCode;
