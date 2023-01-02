import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import ButtonAction from '~/components/ButtonAction';
import { IconSend } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  fabSendDisabled: {
    background: theme.custom.gradients.gray,
  },
  fabSendIcon: {
    position: 'relative',
    top: 1,
    left: -2,
  },
  buttonAction: {
    '&:hover': {
      background: theme.custom.gradients.purpleOppositeHover,
    },
  },
}));

// eslint-disable-next-line react/display-name
const ButtonSend = React.forwardRef(
  ({ className, disabled = false, isPending = false, to, ...props }, ref) => {
    const classes = useStyles();

    return (
      <ButtonAction
        aria-label="Send"
        className={clsx(className, classes.buttonAction, {
          [classes.fabSendDisabled]: disabled || isPending,
        })}
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
      </ButtonAction>
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
