import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '50%',
    zIndex: 0,
    top: 0,
    margin: '0 auto',
    background: 'linear-gradient(180deg, #48B2B7 0%, #06FC9D 100%)',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '&::after': {
      [theme.breakpoints.up('sm')]: {
        width: 1153,
        height: 808,
      },
      position: 'absolute',
      display: 'block',
      top: 553,
      left: '50%',
      width: 690,
      height: 950,
      content: '""',
      backgroundColor: 'white',
      borderRadius: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    },
  },
}));

const BackgroundCurved = (props) => {
  const classes = useStyles();

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
