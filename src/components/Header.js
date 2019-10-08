import PropTypes from 'prop-types';
import React from 'react';

const Header = props => {
  return <header>{props.children}</header>;
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Header;
