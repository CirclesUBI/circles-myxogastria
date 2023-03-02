import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { use100vh } from 'react-div-100vh';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => {
  return {
    app: {
      minWidth: theme.custom.components.appMinWidth,
      maxWidth: theme.custom.components.appMaxWidth,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      margin: '0 auto',
    },
    pinkShadow: {
      width: '100%',
      height: '303px',
      position: 'fixed',
      bottom: '0',
      background: theme.custom.gradients.pinkShade,
      opacity: 0,
      transition: 'opacity 0.1s',
      pointerEvents: 'none',
      zIndex: theme.zIndex.scrollShadow,
    },
    isPinkShadow: {
      opacity: '1',
      transition: 'opacity 0.1s',
    },
  };
});

const PinkShadow = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const [isPinkShadow, setIsPinkShadow] = useState(false);
  const ref = useRef();

  // Fix issue where there was always one pixel too much in the calculation
  const height = use100vh() - 1;

  const applyPinkShadow = () => {
    const { scrollHeight, clientHeight } = ref.current;
    if (scrollHeight <= clientHeight + window.pageYOffset + 1) {
      setIsPinkShadow(false);
    } else {
      setIsPinkShadow(true);
    }
  };

  useEffect(() => {
    applyPinkShadow();
  }, [location]);

  useEffect(() => {
    const onScroll = () => {
      applyPinkShadow();
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const { scrollHeight, clientHeight } = ref.current;
    if (
      scrollHeight > clientHeight &&
      !(scrollHeight <= clientHeight + window.pageYOffset + 1)
    ) {
      setIsPinkShadow(true);
    } else {
      setIsPinkShadow(false);
    }
  }, [ref.current?.scrollHeight]);

  return (
    <>
      <Box
        className={clsx(classes.pinkShadow, {
          [classes.isPinkShadow]: isPinkShadow,
        })}
      ></Box>
      <Box className={classes.app} ref={ref} style={{ height }}>
        {props.children}
      </Box>
    </>
  );
};

PinkShadow.propTypes = {
  children: PropTypes.node,
  gradient: PropTypes.string,
};

export default PinkShadow;
