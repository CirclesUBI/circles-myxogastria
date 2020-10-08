import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Fab, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import { IconSend } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  fabSend: {
    width: 72,
    height: 72,
    position: 'fixed',
    bottom: theme.spacing(2.25),
    right: theme.spacing(2.25),
    background: theme.custom.gradients.purple,
  },
  fabSendDisabled: {
    background: theme.custom.gradients.gray,
  },
  fabSendIcon: {
    position: 'relative',
    top: 1,
    left: -2,
  },
}));

// eslint-disable-next-line react/display-name
const ButtonSend = React.forwardRef(
  ({ className, disabled = false, isPending = false, to, ...props }, ref) => {
    const classes = useStyles();

    return (
      <Fab
        aria-label="Send"
        className={clsx(classes.fabSend, className, {
          [classes.fabSendDisabled]: disabled || isPending,
        })}
        color="primary"
        component={disabled || isPending ? 'div' : Link}
        disabled={disabled || isPending}
        ref={ref}
        style={disabled ? { pointerEvents: 'initial' } : {}}
        to={disabled || isPending ? null : to}
        {...props}
      >
        {isPending ? (
          <CircularProgress color="inherit" size={45} />
        ) : (
          <IconSend className={classes.fabSendIcon} fontSize="large" />
        )}
      </Fab>
    );
  },
);

ButtonSend.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isPending: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

export default ButtonSend;
