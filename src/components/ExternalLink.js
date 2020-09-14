import PropTypes from 'prop-types';
import React from 'react';
import { Link } from '@material-ui/core';

const ExternalLink = ({ children, ...props }) => {
  return (
    <Link rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </Link>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.any.isRequired,
  href: PropTypes.string.isRequired,
};

export default ExternalLink;
