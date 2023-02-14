import { Box, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import ButtonAction from '~/components/ButtonAction';
//import ButtonWobbly from '~/components/ButtonWobbly';
import { IconSend } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  buttonActionSendIcon: {
    color: theme.custom.colors.whiteAlmost,
    left: -2,
    position: 'relative',
    top: 1,
  },
  // fabSendDisabled: {
  //   background: theme.custom.gradients.gray,
  //   '&:hover': {
  //     background: theme.custom.gradients.gray,
  //   },
  // },
}));

// eslint-disable-next-line react/display-name
const ButtonSend = React.forwardRef(
  ({ className, disabled = false, isPending = false, to, ...props }, ref) => {
    const classes = useStyles();

    return (
      <Box>
        {/* <ButtonWobbly
          aria-label="Send"
          // className={clsx(className, classes.buttonAction, {
          //   [classes.fabSendDisabled]: disabled || isPending,
          // })}
          component={disabled || isPending ? 'div' : Link}
          disabled={disabled || isPending}
          icon="IconSend"
          ref={ref}
          style={disabled ? { pointerEvents: 'initial' } : {}}
          to={disabled || isPending ? null : to}
          {...props}
        >
          {isPending ? (
            <CircularProgress color="inherit" size={45} />
          ) : (
            <IconSend className={classes.sendIcon} fontSize="large" />
          )}
        </ButtonWobbly> */}
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
            <IconSend
              className={classes.buttonActionSendIcon}
              fontSize="large"
            />
          )}
        </ButtonAction>
      </Box>
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
