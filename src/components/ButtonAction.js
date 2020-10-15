import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    width: 72,
    height: 72,
    position: 'fixed',
    bottom: theme.spacing(2.25),
    right: theme.spacing(2.25),
    background: theme.custom.gradients.purple,
  },
}));

// eslint-disable-next-line react/display-name
const ButtonAction = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const classes = useStyles();

    return (
      <Fab
        className={clsx(classes.fab, className)}
        color="primary"
        ref={ref}
        {...props}
      >
        {children}
      </Fab>
    );
  },
);

ButtonAction.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ButtonAction;
