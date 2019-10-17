import React from 'react';
import styled from 'styled-components';

import logo from '%/images/logo.png';

const TrustHealthDisplay = () => {
  return <TrustHealthStyle />;
};

const TrustHealthStyle = styled.div`
  width: 15rem;
  height: 15rem;

  margin: 4rem auto;

  background-image: url(${logo});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`;

export default TrustHealthDisplay;
