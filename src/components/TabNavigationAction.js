import { Box, Tab } from '@material-ui/core';
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
    position: 'relative',
  },
  tabContainer: {
    position: 'relative',
  },
  itemsCounterContainer: {
    position: 'absolute',
    background: theme.custom.colors.fountainBlue,
    color: theme.custom.colors.whiteAlmost,
    top: '3px',
    left: '48px',
    borderRadius: '50%',
    padding: '5px',
    height: '17px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    [theme.breakpoints.up('sm')]: {
      left: '93px',
    },
  },
  number: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '-3px',
  },
}));

const TabNavigationAction = ({ className, itemsCounter, ...props }) => {
  const classes = useStyles();

  return (
    <Box className={classes.tabContainer}>
      <Tab
        classes={{
          root: clsx(className, classes.tab),
        }}
        {...props}
      ></Tab>
      {itemsCounter && (
        <Box className={classes.itemsCounterContainer}>
          <span className={classes.number}>{itemsCounter}</span>
        </Box>
      )}
    </Box>
  );
};

TabNavigationAction.propTypes = {
  className: PropTypes.string,
  itemsCounter: PropTypes.number,
};

export default TabNavigationAction;
