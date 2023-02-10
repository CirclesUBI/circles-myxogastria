import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  underline: {
    '& p': {
      color: theme.custom.colors.violet,
      textDecoration: 'underline',
      fontWeight: '500',
    },
  },
}));

const ExternalLink = ({ children, type, ...props }) => {
  const classes = useStyles();

  return (
    <Link
      rel="noopener noreferrer"
      target="_blank"
      {...props}
      className={clsx({
        [classes.underline]: type === 'underline',
      })}
    >
      {children}
    </Link>
  );
};

ExternalLink.propTypes = {
  children: PropTypes.any.isRequired,
  href: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default ExternalLink;
