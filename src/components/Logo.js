import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import CirclesLogoSVG from '%/images/logo.svg';

const sizes = {
  tiny: 50,
  small: 79,
  default: 150,
  large: 200,
};

const Logo = ({ size = 'default' }) => {
  return (
    <Box textAlign="center">
      <CirclesLogoSVG
        height={sizes[size]}
        viewport="0 0 172 172"
        width={sizes[size]}
      />
    </Box>
  );
};

Logo.propTypes = {
  size: PropTypes.string,
};

export default Logo;
