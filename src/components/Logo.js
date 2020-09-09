import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import circlesGang from '%/images/circles-gang.svg';
import logo from '%/images/logo.png';

const Logo = (props) => {
  if (props.isWithGang) {
    return <LogoGangStyle />;
  }

  return <LogoStyle />;
};

const LogoStyle = styled.div`
  width: 12rem;
  height: 12rem;

  margin: 0 auto;

  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

const LogoGangStyle = styled.div`
  position: relative;

  width: 14rem;
  height: 14rem;

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

    width: 18rem;
    height: 18rem;

    content: '';

    background-image: url(${circlesGang});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    transform: rotate(-90deg);
  }
`;

Logo.propTypes = {
  isWithGang: PropTypes.bool,
};

export default Logo;
