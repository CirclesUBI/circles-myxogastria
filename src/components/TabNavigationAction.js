import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tab: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 13,
  },
}));

const TabNavigationAction = ({ className, ...props }) => {
  const classes = useStyles();

  return (
    <Tab
      classes={{
        root: clsx(className, classes.tab),
      }}
      {...props}
    />
  );
};

TabNavigationAction.propTypes = {
  className: PropTypes.string,
};

export default TabNavigationAction;
