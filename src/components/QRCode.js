import PropTypes from 'prop-types';
import QRCodeGenerator from 'qrcode';
import React, { createRef, useState, useEffect } from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const QRCode = props => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const ref = createRef();

  const generateQRCode = () => {
    const options = {
      margin: 0,
      scale: props.scale || null,
      width: 250,
    };

    setIsLoading(true);

    QRCodeGenerator.toCanvas(ref.current, props.data, options, () => {
      setIsLoading(false);
    });
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

  margin: 2rem auto;

  border-radius: 25px;

  background-color: ${styles.monochrome.white};

  align-items: center;
  justify-content: center;
`;

export default QRCode;
