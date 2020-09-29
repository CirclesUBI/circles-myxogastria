import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CirclesGangSVG from '%/images/group.svg';
import logo from '%/images/logo.png';

const useStyles = makeStyles(() => ({
  logo: {
    width: '10rem',
    height: '10rem',
    backgroundImage: `url(${logo})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
  logoTiny: {
    width: '3rem',
    height: '3rem',
  },
  logoSmall: {
    width: '5rem',
    height: '5rem',
  },
  logoLarge: {
    width: '12rem',
    height: '12rem',
  },
  logoWithGang: {
    position: 'relative',
    backgroundImage: 'none',
  },
}));

const Logo = ({ isWithGang, size = 'default' }) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.logo, {
        [classes.logoWithGang]: isWithGang,
        [classes.logoTiny]: size === 'tiny',
        [classes.logoSmall]: size === 'small',
        [classes.logoLarge]: size === 'large' || isWithGang,
      })}
      mx="auto"
    >
      {isWithGang && (
        <CirclesGangSVG className={classes.logoGang} viewport="0 0 311 272" />
      )}
    </Box>
  );
};

Logo.propTypes = {
  isWithGang: PropTypes.bool,
  size: PropTypes.string,
};

export default Logo;
