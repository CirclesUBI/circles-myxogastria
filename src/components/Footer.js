import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const Footer = (props) => {
  return (
    <Box component="footer" mt="auto" p={'32px'}>
      {props.children}
    </Box>
  );
};

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
