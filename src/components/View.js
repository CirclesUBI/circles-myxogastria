import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  offset: {
    minHeight: theme.custom.components.appBarHeight,
  },
}));

const View = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Box className={classes.offset} />
      <Box component="main" {...props}>
        {children}
      </Box>
    </Fragment>
  );
};

View.propTypes = {
  children: PropTypes.node.isRequired,
};

export default View;
