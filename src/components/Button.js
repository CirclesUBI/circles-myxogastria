import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '16px',
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
      background: theme.custom.colors.lola,
      borderRadius: '30px',
      color: theme.custom.colors.lily,
      'pointer-events': 'visible',

      '&:hover': {
        background: theme.custom.colors.lola,
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

      '& .MuiButton-label': {
        background: theme.custom.gradients.lightPinkToPurple,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
      },
    },
    '&.Mui-disabled': {
      background: theme.custom.colors.whiteAlmost,
      borderColor: theme.custom.colors.lola,

      '& .MuiButton-label': {
        background: 'none',
        color: theme.custom.colors.lola,
        '-webkit-text-fill-color': theme.custom.colors.lola,
      },
    },
    '& .MuiButton-label': {
      background: theme.custom.gradients.pinkToPurple,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
  },
  buttonDanger: {
    background: theme.custom.colors.red,
    color: theme.palette.common.white,
  },
  buttonWhiteText: {
    color: theme.custom.colors.white,
    background: 'transparent',
    '&:hover': {
      background: theme.custom.colors.lightGrey,
      '& .MuiButton-label': {
        '-webkit-text-fill-color': theme.custom.colors.white,
      },
    },
    '& .MuiButton-label': {
      '-webkit-text-fill-color': theme.custom.colors.white,
    },
  },
  buttonText: {
    border: 0,
    background: theme.custom.gradients.purple,
    backgroundClip: 'text',
    color: 'transparent',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    '&:hover': {
      background: theme.custom.colors.lightPinkToPurple,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
    },
    '&.Mui-disabled': {
      background: 'transparent',
      color: theme.custom.colors.lily,
      '-webkit-text-fill-color': theme.custom.colors.lily,

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

    return React.createElement(
      MuiButton,
      {
        className,
        ref,
        ...(to
          ? {
              to,
              component: Link,
            }
          : {}),
        ...props,
      },
      children,
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
