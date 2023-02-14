import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { IconWobblyCircle } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  buttonAction: {
    width: 72,
    height: 72,
    position: 'fixed',
    bottom: theme.spacing(2.25),
    right: theme.spacing(2.25),
    background: 'transparent', //theme.custom.gradients.purple,
  },
  buttonDisabled: {
    //background: theme.custom.gradients.gray,
    '& stop:first-of-type': {
      stopColor: theme.custom.gradients.gray,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.gradients.gray,
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
  // buttonIcon: {
  //   position: 'relative',
  //   left: 1,
  //   fontSize: '2.4rem',
  // },
  buttonActionAction: {
    '&:hover': {
      background: theme.custom.gradients.purpleOppositeHover,
    },
  },
  buttonIconBackground: {
    width: '72px',
    height: '72px',
    position: 'absolute',
  },
}));

// eslint-disable-next-line react/display-name
const ButtonAction = React.forwardRef(({ className, children, ...props }) => {
  const classes = useStyles();

  return (
    <IconButton
      className={className}
      classes={{
        root: clsx(classes.buttonAction),
        disabled: classes.buttonDisabled,
      }}
      disabled
      {...props}
    >
      <Box className={classes.buttonContainer}>
        <IconWobblyCircle className={classes.buttonIconBackground} />
        {children}
      </Box>
    </IconButton>
    // <Fab
    //   className={clsx(classes.fab, className)}
    //   color="primary"
    //   ref={ref}
    //   {...props}
    // >
    //   {children}
    // </Fab>
  );
});

ButtonAction.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ButtonAction;
