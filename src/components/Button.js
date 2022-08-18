import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: theme.typography.fontWeightRegular,
    textTransform: 'none',
    borderRadius: 16,
    zIndex: theme.zIndex.layer2,
  },
  buttonDark: {
    color: theme.palette.text.primary,
  },
  buttonOutline: {
    height: '43.5px', // Make it as high as the other buttons
    color: theme.palette.primary.main,
    border: `${theme.palette.primary.main} 2px solid`,
    '&.Mui-disabled': {
      borderColor: theme.palette.action.disabled,
    },
  },
  buttonDanger: {
    background: theme.custom.colors.red,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.custom.colors.red,
    },
  },
  buttonPrimary: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    '&.Mui-disabled': {
      background: theme.custom.gradients.grayDark,
      color: theme.custom.colors.white,
    },
  },
  buttonWhite: {
    background: theme.custom.colors.white,
    color: theme.custom.colors.purpleDark,
    '&:hover': {
      backgroundColor: theme.custom.colors.grayLight,
    },
  },
  buttonWhiteText: {
    color: theme.custom.colors.white,
  },
  buttonGradientBorder: {
    background: `linear-gradient(${theme.custom.colors.white}, ${theme.custom.colors.white}) padding-box,
    linear-gradient(to right, ${theme.custom.colors.purple}, ${theme.custom.colors.purpleDark}) border-box`,
    border: '1px solid transparent',
  },
  buttonWithoutBorder: {
    border: 0,
    background: theme.custom.gradients.purple,
    backgroundClip: 'text',
    color: 'transparent',
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
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
      isDark,
      isOutline,
      isPrimary,
      isWhite,
      isWhiteText,
      isGradientBorder,
      isWithoutBorder,
      to,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles();

    const className = clsx(classes.button, classNameExternal, {
      [classes.buttonDanger]: isDanger,
      [classes.buttonDark]: isDark,
      [classes.buttonOutline]: isOutline,
      [classes.buttonPrimary]: isPrimary,
      [classes.buttonWhite]: isWhite,
      [classes.buttonWhiteText]: isWhiteText,
      [classes.buttonGradientBorder]: isGradientBorder,
      [classes.buttonWithoutBorder]: isWithoutBorder,
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
  isDark: PropTypes.bool,
  isGradientBorder: PropTypes.bool,
  isOutline: PropTypes.bool,
  isPrimary: PropTypes.bool,
  isWhite: PropTypes.bool,
  isWhiteText: PropTypes.bool,
  isWithoutBorder: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Button;
