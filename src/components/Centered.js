import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  centered: {
    position: 'absolute',
    left: theme.spacing(10),
    right: theme.spacing(10),
  },
}));

const Centered = ({ children }) => {
  const classes = useStyles();
  return <Box className={classes.centered}>{children}</Box>;
};

Centered.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Centered;
