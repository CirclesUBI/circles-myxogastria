import PropTypes from 'prop-types';
import React from 'react';

const ButtonHeader = ({ children, ...props }) => {
  return < {...props}>{children}</ButtonHeaderStyle>;
};

ButtonHeader.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonHeader;
