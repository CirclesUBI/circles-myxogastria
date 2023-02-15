import { Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: theme.spacing(2),
    '& .MuiTabs-indicator': {
      backgroundColor: theme.custom.colors.fountainBlue,
      height: '1px',
    },
  },
}));

const TabNavigation = ({ className, children, ...props }) => {
  const classes = useStyles();

  return (
    <Tabs
      centered
      className={clsx(className, classes.tabs)}
      indicatorColor="primary"
      scrollButtons="off"
      variant="fullWidth"
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
