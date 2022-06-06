import { Fab, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  EDIT_PROFILE,
  MY_PROFILE_PATH,
  ORGANIZATION_MEMBERS_ADD_PATH,
} from '~/routes';

import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconClose } from '~/styles/icons';
import { FAQ_URL, MARKETPLACE_MARKET_URL } from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  menuNavigation: {
    '&#navigation-floating-menu': {
      background: theme.custom.colors.doveGray,
    },

    '& .MuiMenu-paper.MuiMenu-paper': {
      background: (props) => {
        switch (props.color) {
          case 'turquoise':
            return theme.custom.colors.fountainBlue;
          case 'violet':
            return theme.custom.colors.violet;
          default:
            return theme.custom.colors.fountainBlue;
        }
      },
      borderRadius: 0,
      borderBottomRightRadius: '26px',
      width: 'calc(100% - 30px)',
      maxWidth: '385px',
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
      textDecoration: 'none',

      '& a': {
        color: theme.custom.colors.purple,
        fontSize: '16px',
        fontWeight: '500',
      },
    },

    '& a': {
      textDecoration: 'none',
    },

    '& a:hover': {
      textDecoration: 'none',
    },
  },

  fabContainer: {
    bottom: '15px',
    right: '15px',
    position: 'fixed',
    color: theme.custom.colors.white,
    background: (props) => {
      switch (props.color) {
        case 'fountainBlue':
          return theme.custom.colors.fountainBlue;
        case 'violet':
          return theme.custom.colors.violet;
        default:
          return theme.custom.colors.fountainBlue;
      }
    },
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

export default function NavigationFloating(props) {
  const classes = useStyles(props);

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
        {props.isAddMembersLink && (
          <Link to={ORGANIZATION_MEMBERS_ADD_PATH}>
            <MenuItem>
              {translate('NavigationFloating.linkAddMembers')}
            </MenuItem>
          </Link>
        )}
        <Link to={EDIT_PROFILE}>
          <MenuItem>{translate('NavigationFloating.linkEditProfile')}</MenuItem>
        </Link>
        <Link to={MY_PROFILE_PATH}>
          <MenuItem>{translate('NavigationFloating.linkMyWallets')}</MenuItem>
        </Link>
        <ExternalLink href={MARKETPLACE_MARKET_URL}>
          <MenuItem>{translate('NavigationFloating.linkMarketplace')}</MenuItem>
        </ExternalLink>
        <ExternalLink href={FAQ_URL}>
          <MenuItem>{translate('NavigationFloating.linkSupport')}</MenuItem>
        </ExternalLink>
        <IconClose
          className={classes.menuNavigationIconClose}
          onClick={handleClose}
        />
      </Menu>
    </div>
  );
}

NavigationFloating.propTypes = {
  gradient: PropTypes.string,
  isAddMembersLink: PropTypes.bool,
};
