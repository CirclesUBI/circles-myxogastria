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
  logoWithGang: {
    width: '12rem',
    height: '12rem',
    position: 'relative',
    backgroundImage: 'none',
  },
}));

const Logo = (props) => {
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.logo, {
        [classes.logoWithGang]: props.isWithGang,
      })}
      mx="auto"
    >
      {props.isWithGang && (
        <CirclesGangSVG className={classes.logoGang} viewport="0 0 311 272" />
      )}
    </Box>
  );
};

Logo.propTypes = {
  isWithGang: PropTypes.bool,
};

export default Logo;
