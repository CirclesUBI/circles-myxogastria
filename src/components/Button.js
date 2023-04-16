import { Button as MuiButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { fontSizeRegular } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: fontSizeRegular,
    textTransform: 'none',
    borderRadius: 30,
    zIndex: theme.zIndex.layer2,
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    height: '40px',
    '&:hover': {
      background: theme.custom.gradients.purpleHover,
    },
    '&.Mui-disabled': {
      background: theme.custom.colors.purple500,
      borderRadius: '30px',
      color: theme.custom.colors.purple400,
      'pointer-events': 'visible',

      '&:hover': {
        background: theme.custom.colors.purple500,
      },
    },
  },
  buttonOutline: {
    color: theme.palette.primary.main,
    background: `linear-gradient(${theme.custom.colors.whiteAlmost}, ${theme.custom.colors.whiteAlmost}) padding-box,
    ${theme.custom.gradients.pinkToPurple} border-box`,
    position: 'relative',
    border: '1px solid transparent',
    borderRadius: '30px',
    '&:hover': {
      background: `linear-gradient(${theme.custom.colors.whiteAlmost}, ${theme.custom.colors.whiteAlmost}) padding-box,
      ${theme.custom.gradients.lightPinkToPurple} border-box`,
      '& .MuiTouchRipple-root': {
        background: theme.custom.gradients.lightPinkToPurple,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
      },
    },
    '&.Mui-disabled': {
      background: theme.custom.colors.whiteAlmost,
      borderColor: theme.custom.colors.purple500,
      '& .MuiTouchRipple-root': {
        background: 'none',
        color: theme.custom.colors.purple500,
        '-webkit-text-fill-color': theme.custom.colors.purple500,
        textFillColor: 'transparent',
      },
    },
    '& .MuiTouchRipple-root': {
      background: theme.custom.gradients.pinkToPurple,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
    },
  },
  buttonDanger: {
    // danger styling design currently is the same as normal
  },
  buttonWhiteText: {
    color: theme.custom.colors.white,
    background: 'transparent',
    '&:hover': {
      background: theme.custom.colors.lightGrey,
      '& .MuiTouchRipple-root': {
        '-webkit-text-fill-color': theme.custom.colors.white,
        textFillColor: theme.custom.colors.white,
      },
    },
    '& .MuiTouchRipple-root': {
      '-webkit-text-fill-color': theme.custom.colors.white,
      textFillColor: theme.custom.colors.white,
    },
  },
  buttonText: {
    border: 0,
    background: theme.custom.gradients.purple,
    color: 'transparent',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    '&:hover': {
      background: theme.custom.colors.lightPinkToPurple,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
    },
    '&.Mui-disabled': {
      background: 'transparent',
      color: theme.custom.colors.purple400,
      '-webkit-text-fill-color': theme.custom.colors.purple400,
      textFillColor: theme.custom.colors.purple400,
      '&:hover': {
        cursor: 'not-allowed',
        'pointer-events': 'visible',
      },
    },
  },
}));

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    {
      children,
      className: classNameExternal,
      isDanger,
      isOutline,
      isWhiteText,
      isText,
      to,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles();

    const className = clsx(classes.button, classNameExternal, {
      [classes.buttonDanger]: isDanger,
      [classes.buttonOutline]: isOutline,
      [classes.buttonWhiteText]: isWhiteText,
      [classes.buttonText]: isText,
    });

    return (
      <MuiButton
        className={className}
        ref={ref}
        {...(to ? { to, component: Link } : {})}
        {...props}
      >
        {children}
      </MuiButton>
    );
  },
);

Button.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  isDanger: PropTypes.bool,
  isOutline: PropTypes.bool,
  isText: PropTypes.bool,
  isWhiteText: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Button;
