import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { IconCirclesYellow } from '../styles/icons';

import CirclesLogoGroupSVG from '%/images/logo-group.svg';
import CirclesLogoSVG from '%/images/logo.svg';

const Logo = ({ type, size = 'default' }) => {
  const sizes = {
    tiny: 50,
    small: 100,
    default: 150,
    large: 200,
  };

  switch (type) {
    case 'isWithGang':
      return (
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
      );
    case 'yellow':
      return (
        <Box textAlign="center">
          <IconCirclesYellow
            sx={{ width: `${sizes[size]}px`, height: `${sizes[size]}px` }}
          />
        </Box>
      );
    default:
      return (
        <Box textAlign="center">
          <CirclesLogoSVG
            height={sizes[size]}
            viewport="0 0 172 172"
            width={sizes[size]}
          />
        </Box>
      );
  }
};

Logo.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
};

export default Logo;
