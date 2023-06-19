import { Box, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { fontSizeSmaller, fontWeightMedium } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  tab: {
    padding: '11px 8px 0',
    textTransform: 'none',
    position: 'relative',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: fontSizeSmaller,
    color: theme.custom.colors.lily,
    borderBottom: '1px solid transparent',
    '& g, & path': {
      fill: theme.custom.colors.lily,
    },
    '&:hover': {
      borderBottom: `1px solid ${theme.custom.colors.oldLavender}`,
      color: theme.custom.colors.oldLavender,
      '& g, & path': {
        fill: theme.custom.colors.oldLavender,
      },
    },
    '&.Mui-selected': {
      color: theme.custom.colors.violet,
      '& g, & path': {
        fill: theme.custom.colors.violet,
      },
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
      paddingBottom: '3px',

      '& .MuiTab-wrapper > *:first-child': {
        marginBottom: '0',
      },
    },
    '& .MuiBadge-root': {
      marginBottom: '3px',
    },
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
    fontSize: fontSizeSmaller, // TODO: check correctness from rebase, was '12px',
    fontWeight: fontWeightMedium,
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
          selected: classes.selected,
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
