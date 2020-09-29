import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { BottomNavigationAction } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  bottomNavigationAction: {
    maxWidth: 'none',
    padding: 0,
    '&.Mui-selected': {
      padding: 0,
    },
  },
  bottomNavigationLabel: {
    marginTop: theme.spacing(1),
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 13,
    borderBottom: '2px solid transparent',
    '&.Mui-selected': {
      fontSize: 13,
      borderBottomColor: theme.palette.primary.main,
    },
  },
}));

const TabNavigationAction = ({ className, ...props }) => {
  const classes = useStyles();

  return (
    <BottomNavigationAction
      classes={{
        root: clsx(className, classes.bottomNavigationAction),
        label: classes.bottomNavigationLabel,
      }}
      {...props}
    />
  );
};

TabNavigationAction.propTypes = {
  className: PropTypes.string,
};

export default TabNavigationAction;
