import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Button as MuiButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: theme.typography.fontWeightRegular,
    textTransform: 'none',
    borderRadius: 16,
  },
  buttonDark: {
    color: theme.palette.text.primary,
  },
  buttonOutline: {
    color: theme.palette.primary.main,
    border: `${theme.palette.primary.main} 2px solid`,
  },
  buttonDanger: {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  buttonPrimary: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    '&.Mui-disabled': {
      background: theme.custom.gradients.gray,
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
    });

    if (to) {
      return (
        <MuiButton
          className={className}
          component={Link}
          ref={ref}
          to={to}
          {...props}
        >
          {children}
        </MuiButton>
      );
    }

    return (
      <MuiButton
        className={className}
        ref={ref}
        onClick={props.onClick}
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
  isDark: PropTypes.bool,
  isOutline: PropTypes.bool,
  isPrimary: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Button;
