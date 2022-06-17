import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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
      opacity: 1,
      transition: 'opacity 0.15s',
      background: (props) => {
        if (
          typeof window != 'undefined' &&
          window.innerWidth >= theme.breakpoints.values.sm
        ) {
          switch (props.gradient) {
            case 'turquoise':
              return theme.custom.gradients.greenBlue;
            case 'violet':
              return theme.custom.gradients.violetCurved;
          }
        } else {
          switch (props.gradient) {
            case 'turquoise':
              return theme.custom.gradients.greenBlue;
            case 'violet':
              return theme.custom.gradients.violetCurved;
          }
        }
      },
    },
    isHidden: {
      opacity: 0,
    },
    background: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      '&::after': {
        width: 750,
        height: 750,
        position: 'absolute',
        display: 'block',
        top: 476,
        left: '50%',
        content: '""',
        backgroundColor: 'white',
        borderRadius: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
        [theme.breakpoints.up('sm')]: {
          width: 1188,
          height: 808,
        },
        [theme.breakpoints.up('md')]: {
          width: '1369px',
          height: '878px',
          top: '516px',
        },
        [theme.breakpoints.up('lg')]: {
          top: '77px',
          width: '150%',
          height: '200%',
          transform: 'translate3d(-50%, 0, 0)',
        },
      },
    },
  };
});

const BackgroundCurved = (props) => {
  const classes = useStyles(props);

  const [isHidden, setIsHidden] = useState('');

  useEffect(() => {
    window.addEventListener('scroll', () =>
      setIsHidden(window.pageYOffset > 1),
    );
  }, []);

  return (
    <>
      <Box
        className={clsx(classes.wrapper, {
          [classes.isHidden]: isHidden,
        })}
      >
        <Box className={classes.background}></Box>
      </Box>
      {props.children}
    </>
  );
};

BackgroundCurved.propTypes = {
  children: PropTypes.node,
  gradient: PropTypes.string,
};

export default BackgroundCurved;
