import { Popover } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  popOverContainer: {
    padding: '32px 32px 30px',
    background: theme.custom.colors.whiteAlmost,
    borderRadius: '20px',
    boxShadow: theme.custom.shadows.navigationFloating,
  },
}));

const PopoverTab = ({ children, className, ...props }) => {
  const classes = useStyles();

  return (
    <Popover
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      classes={{ paper: clsx(classes.popOverContainer, className) }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    >
      {children}
    </Popover>
  );
};

PopoverTab.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default PopoverTab;
