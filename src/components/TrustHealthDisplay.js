import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import circlesGang from '%/images/circles-gang.svg';
import logo from '%/images/logo.png';

const TrustHealthDisplay = props => {
  if (props.isTrusted) {
    return <TrustStyle />;
  }

  return <NoTrustStyle />;
};

const NoTrustStyle = styled.div`
  width: 10rem;
  height: 10rem;

  margin: 0 auto;

  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const TrustStyle = styled.div`
  position: relative;

  width: 20rem;
  height: 20rem;

  margin: 0 auto;
  margin-top: 4rem;

  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  transform: rotate(90deg);

  &::after {
    position: absolute;

    top: -20px;
    right: 0;

    display: block;

    width: 25rem;
    height: 25rem;

    content: '';

    background-image: url(${circlesGang});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    transform: rotate(-90deg);
  }
`;

TrustHealthDisplay.propTypes = {
  isTrusted: PropTypes.bool.isRequired,
};

export default TrustHealthDisplay;
