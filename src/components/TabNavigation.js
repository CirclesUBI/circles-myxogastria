import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(2),
  },
}));

const TabNavigation = ({ className, children, ...props }) => {
  const classes = useStyles();

  return (
    <Tabs
      centered
      className={clsx(className, classes.tabs)}
      indicatorColor="primary"
      {...props}
    >
      {children}
    </Tabs>
  );
};

TabNavigation.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TabNavigation;
