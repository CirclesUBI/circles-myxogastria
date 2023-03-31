import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

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
