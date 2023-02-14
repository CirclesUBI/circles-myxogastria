import { Tab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: '11px 8px 0',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 12,

    '&.MuiTab-labelIcon': {
      minHeight: 'auto',

      '& .MuiTab-wrapper > *:first-child': {
        marginBottom: '0',
      },
    },
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
