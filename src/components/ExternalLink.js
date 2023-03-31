import { Link } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const ExternalLink = ({ children, underline, ...props }) => {
  return (
    <Link
      rel="noopener noreferrer"
      target="_blank"
      underline={underline}
      {...props}
    >
      {children}
    </Link>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.any.isRequired,
  href: PropTypes.string.isRequired,
  underline: PropTypes.string,
};

export default ExternalLink;
