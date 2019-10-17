import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Spinner from '~/components/Spinner';
import styles from '~/styles/variables';
import { IconSpinner } from '~/styles/Icons';

const TRANSITION_DURATION = 250;

const SpinnerOverlay = props => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  useEffect(() => {
    if (props.isVisible) {
      setIsVisible(true);

      window.setTimeout(() => {
        setIsSpinnerVisible(true);
      });
    } else {
      setIsSpinnerVisible(false);

      window.setTimeout(() => {
        setIsVisible(false);
      }, TRANSITION_DURATION);
    }
  }, [props.isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <SpinnerOverlayStyle isVisible={isSpinnerVisible}>
      <Spinner isDark />
    </SpinnerOverlayStyle>
  );
};

SpinnerOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export const SpinnerOverlayStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.spinnerOverlay};

  display: flex;

  background-color: rgba(255, 255, 255, 0.9);

  opacity: ${props => {
    return props.isVisible ? 1 : 0;
  }};

  transition: opacity ${TRANSITION_DURATION}ms linear;

  align-items: center;
  justify-content: center;

  ${IconSpinner} {
    &::before {
      font-size: 10em;
    }
  }
`;

export default SpinnerOverlay;
