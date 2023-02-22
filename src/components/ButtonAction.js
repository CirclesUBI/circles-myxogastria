import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { IconWobblyCircleSecond } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  buttonAction: {
    width: 72,
    height: 72,
    position: 'fixed',
    bottom: theme.spacing(2.25),
    right: theme.spacing(2.25),
    background: 'transparent',

    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.cannonPink,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.cranberry,
      },
    },
  },
  buttonContainer: {
    width: '72px',
    height: '72px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'transparent',
  },
  buttonIconBackground: {
    width: '72px',
    height: '72px',
    position: 'absolute',
  },
  buttonDisabled: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.grayDark,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.gray,
    },
  },
}));

// eslint-disable-next-line react/display-name
const ButtonAction = React.forwardRef(
  ({ className, children, disabled, ...props }) => {
    const classes = useStyles();

    return (
      <IconButton
        className={className}
        classes={{
          root: clsx(classes.buttonAction),
          disabled: classes.buttonDisabled,
        }}
        disabled={disabled}
        {...props}
      >
        <Box className={classes.buttonContainer}>
          <IconWobblyCircleSecond className={classes.buttonIconBackground} />
          {children}
        </Box>
      </IconButton>
    );
  },
);

ButtonAction.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonAction;
