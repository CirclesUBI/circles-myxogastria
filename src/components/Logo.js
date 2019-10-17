import React from 'react';
import styled from 'styled-components';

import logo from '%/images/logo.png';

const Logo = () => {
  return <LogoStyle />;
};

const LogoStyle = styled.div`
  width: 15rem;
  height: 15rem;

  margin: 0 auto;

  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export default Logo;
