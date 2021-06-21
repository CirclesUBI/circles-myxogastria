import { Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: theme.spacing(1),
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
