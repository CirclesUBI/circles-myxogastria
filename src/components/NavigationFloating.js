import { Fab, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  //EDIT_PROFILE,
  MY_PROFILE_PATH,
  ORGANIZATION_MEMBERS_PATH,
} from '~/routes';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconClose } from '~/styles/icons';
import { FAQ_URL, MARKETPLACE_URL } from '~/utils/constants';

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

    '& .MuiMenu-list': {
      paddingTop: '25px',
    },

    '& .MuiListItem-root': {
      justifyContent: 'center',
      cursor: 'auto',
      width: '100%',
      marginBottom: '15px',
    },

    '& .MuiMenuItem-root': {
      padding: '9px 35px',
    },

    '& .MuiButton-root': {
      width: '100%',
    },

    '& a': {
      textDecoration: 'none',
      width: '100%',
    },

    '& a:hover': {
      textDecoration: 'none',
    },
  },

  fabContainer: {
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
    bottom: '15px',
    color: theme.custom.colors.white,
    position: 'fixed',
    right: '15px',
    zIndex: theme.zIndex.layer2,
  },

  dotsText: {
    fontSize: '44px',
    lineHeight: '65px',
    position: 'relative',
    top: '-11px',
  },

  menuNavigationIconClose: {
    color: theme.custom.colors.white,
    cursor: 'pointer',
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
          <MenuItem>
            <Link to={ORGANIZATION_MEMBERS_PATH}>
              <Button isOutline isWhite>
                {translate('NavigationFloating.linkAddMembers')}
              </Button>
            </Link>
          </MenuItem>
        )}
        {/*<MenuItem>
          <Link to={EDIT_PROFILE}>
            <Button isOutline isWhite>
              {translate('NavigationFloating.linkEditProfile')}
            </Button>
          </Link>
        </MenuItem>*/}
        <MenuItem>
          <Link to={MY_PROFILE_PATH}>
            <Button isOutline isWhite>
              {translate('NavigationFloating.linkMyWallets')}
            </Button>
          </Link>
        </MenuItem>
        <ExternalLink href={MARKETPLACE_URL}>
          <MenuItem>
            <Button isOutline isWhite>
              {translate('NavigationFloating.linkMarketplace')}
            </Button>
          </MenuItem>
        </ExternalLink>
        <ExternalLink href={FAQ_URL}>
          <MenuItem>
            <Button isOutline isWhite>
              {translate('NavigationFloating.linkSupport')}
            </Button>
          </MenuItem>
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
