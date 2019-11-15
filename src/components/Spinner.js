import PropTypes from 'prop-types';
import React from 'react';
import styled, { keyframes } from 'styled-components';

import { IconSpinner } from '~/styles/Icons';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = props => {
  if (props.isHidden) {
    return null;
  }

  return (
    <SpinnerStyle>
      <IconSpinner isDark={props.isDark} />
    </SpinnerStyle>
  );
};

Spinner.propTypes = {
  isDark: PropTypes.bool,
  isHidden: PropTypes.bool,
};

export const SpinnerStyle = styled.div`
  display: flex;

  line-height: 1;

  animation: ${rotate} 2s linear infinite;
  animation-direction: reverse;

  align-items: center;
  justify-content: center;

  ${IconSpinner} {
    &::before {
      font-size: 3em;
    }
  }
`;

export default Spinner;
