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
    color: theme.custom.colors.lily,
    borderBottom: '1px solid transparent',
    '&:hover': {
      borderBottom: `1px solid ${theme.custom.colors.oldLavender}`,
      '& .MuiTab-wrapper': {
        color: theme.custom.colors.oldLavender,
      },
      '& g, & path': {
        fill: theme.custom.colors.oldLavender,
      },
    },
    '&.Mui-selected': {
      color: theme.custom.colors.violet,
      '&:hover': {
        '& .MuiTab-wrapper': {
          color: theme.custom.colors.violet,
        },
        '& g, & path': {
          fill: theme.custom.colors.violet,
        },
      },
    },
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
