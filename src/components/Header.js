import PropTypes from 'prop-types';
import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';

const Header = ({ children, ...props }) => {
  return (
    <AppBar position="fixed" {...props}>
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
