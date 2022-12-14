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
  },
  buttonDark: {
    color: theme.palette.text.primary,
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
    '&:hover': {
      backgroundColor: theme.custom.colors.red,
    },
  },
  buttonPrimary: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.custom.gradients.purpleHover,
    },
    '&.Mui-disabled': {
      background: theme.custom.colors.lola,
      borderRadius: '30px',
      color: theme.custom.colors.lily,
      height: '40px',
    },
  },
  buttonGradientOpposite: {
    background: theme.custom.gradients.purpleOpposite,
    '&:hover': {
      background: theme.custom.gradients.purpleOppositeHover,
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
      isDisabled,
      isGradientOpposite,
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
      [classes.buttonGradientOpposite]: isGradientOpposite,
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
  isDisabled: PropTypes.bool,
  isGradientBorder: PropTypes.bool,
  isGradientOpposite: PropTypes.bool,
  isOutline: PropTypes.bool,
  isPrimary: PropTypes.bool,
  isWhite: PropTypes.bool,
  isWhiteText: PropTypes.bool,
  isWithoutBorder: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Button;
