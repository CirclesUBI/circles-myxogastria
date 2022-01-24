import { Fab, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import { IconClose } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  menuNavigation: {
    '&#navigation-floating-menu': {
      background: theme.custom.colors.doveGray,
    },

    '& .MuiMenu-paper': {
      background: theme.custom.gradients.orange,
      borderRadius: 0,
      borderBottomRightRadius: '26px',
      width: '100%',
      padding: '17px 0 30px',
    },

    '& .MuiListItem-root': {
      justifyContent: 'center',
    },

    '& .MuiMenuItem-root': {
      background: theme.custom.colors.white,
      border: `1px solid ${theme.custom.colors.purple}`,
      boxShadow: theme.custom.shadows.gray,
      borderRadius: '16px',
      margin: '30px 32px',
      padding: '9px',
      minHeight: 'auto',
      color: theme.custom.colors.purple,
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: '500',
    },
  },

  fabContainer: {
    bottom: '15px',
    right: '15px',
    position: 'fixed',
    color: theme.custom.colors.white,
    background: theme.custom.gradients.orange,
  },

  dotsText: {
    fontSize: '44px',
    lineHeight: '65px',
    position: 'relative',
    top: '-11px',
  },

  menuNavigationIconClose: {
    color: theme.custom.colors.white,
    width: '19px',
    position: 'absolute',
    bottom: '-12px',
    right: '20px',
  },
}));

export default function NavigationFloating() {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Fab
        aria-controls={open ? 'navigation-floating-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        className={classes.fabContainer}
        id="navigation-floating-menu-btn"
        onClick={handleClick}
      >
        <span className={classes.dotsText}>...</span>
      </Fab>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        aria-labelledby="navigation-floating-menu-btn"
        className={classes.menuNavigation}
        id="navigation-floating-menu"
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Add Members</MenuItem>
        <MenuItem onClick={handleClose}>Edit Probile</MenuItem>
        <MenuItem onClick={handleClose}>My Walelts</MenuItem>
        <MenuItem onClick={handleClose}>Marketplace</MenuItem>
        <MenuItem onClick={handleClose}>Support</MenuItem>
        <IconClose
          className={classes.menuNavigationIconClose}
          onClick={handleClose}
        />
      </Menu>
    </div>
  );
}
