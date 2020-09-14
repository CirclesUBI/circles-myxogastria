import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@material-ui/core';

const Footer = (props) => {
  return (
    <Box component="footer" mt="auto" p={2}>
      {props.children}
    </Box>
  );
};

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Footer;
