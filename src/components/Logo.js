import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@material-ui/core';

import CirclesLogoGroupSVG from '%/images/logo-group.svg';
import CirclesLogoSVG from '%/images/logo.svg';

const Logo = ({ isWithGang, size = 'default' }) => {
  const sizes = {
    tiny: 50,
    small: 100,
    default: 150,
    large: 200,
  };

  return isWithGang ? (
    <Box
      mx={'auto'}
      style={{ position: 'relative', width: '202px', height: '180px' }}
    >
      <CirclesLogoSVG
        height={175}
        style={{
          position: 'absolute',
          top: 15,
          left: 15,
          transform: 'rotate(90deg)',
        }}
        viewport="0 0 172 172"
        width={175}
      />
      <CirclesLogoGroupSVG
        height={173}
        style={{ position: 'absolute', top: 0, left: 0 }}
        viewport="0 0 311 272"
        width={202}
      />
    </Box>
  ) : (
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
  isWithGang: PropTypes.bool,
  size: PropTypes.string,
};

export default Logo;
