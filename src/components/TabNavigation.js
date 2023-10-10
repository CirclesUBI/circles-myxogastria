import { Tabs } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginBottom: '43px',
    '& .MuiTabs-indicator': {
      backgroundColor: theme.custom.colors.blue100,
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
      scrollButtons={false}
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
