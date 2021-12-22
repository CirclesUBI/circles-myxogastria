import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '50%',
      zIndex: theme.zIndex.backgroundCurvedWrapper,
      top: 0,
      margin: '0 auto',
      background: (props) => props.gradient,
    },
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      '&::after': {
        width: 750,
        height: 750,
        [theme.breakpoints.up('sm')]: {
          width: 1153,
          height: 808,
        },
        position: 'absolute',
        display: 'block',
        top: 476,
        left: '50%',
        content: '""',
        backgroundColor: 'white',
        borderRadius: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
      },
    },
  };
});

const BackgroundCurved = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <Box className={classes.wrapper}>
        <Box className={classes.background}></Box>
      </Box>
      {props.children}
    </>
  );
};

BackgroundCurved.propTypes = {
  children: PropTypes.node,
};

export default BackgroundCurved;
