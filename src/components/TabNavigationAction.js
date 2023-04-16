import { Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: '11px 8px 0',
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightLight,
    fontSize: 12,
    color: theme.custom.colors.purple400,
    borderBottom: '1px solid transparent',
    '& g, & path': {
      fill: theme.custom.colors.purple400,
    },
    '&:hover': {
      borderBottom: `1px solid ${theme.custom.colors.purple200}`,
      color: theme.custom.colors.purple200,
      '& g, & path': {
        fill: theme.custom.colors.purple200,
      },
    },
    '&.Mui-selected': {
      color: theme.custom.colors.purple100,
      '& g, & path': {
        fill: theme.custom.colors.purple100,
      },
      '&:hover': {
        '& .MuiTab-wrapper': {
          color: theme.custom.colors.purple100,
        },
        '& g, & path': {
          fill: theme.custom.colors.purple100,
        },
      },
    },
    '&.MuiTab-labelIcon': {
      minHeight: 'auto',
      paddingBottom: '3px',

      '& .MuiTab-wrapper > *:first-child': {
        marginBottom: '0',
      },
    },
    '& .MuiBadge-root': {
      marginBottom: '3px',
    },
  },
}));

const TabNavigationAction = ({ className, ...props }) => {
  const classes = useStyles();

  return (
    <Tab
      classes={{
        root: clsx(className, classes.tab),
        selected: classes.selected,
      }}
      {...props}
    />
  );
};

TabNavigationAction.propTypes = {
  className: PropTypes.string,
};

export default TabNavigationAction;
