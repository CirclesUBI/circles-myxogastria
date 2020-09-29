import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { BottomNavigation } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bottomNavigation: {
    marginBottom: theme.spacing(2),
  },
}));

const TabNavigation = ({ className, children, ...props }) => {
  const classes = useStyles();

  return (
    <BottomNavigation
      className={clsx(className, classes.bottomNavigation)}
      showLabels
      {...props}
    >
      {children}
    </BottomNavigation>
  );
};

TabNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TabNavigation;
