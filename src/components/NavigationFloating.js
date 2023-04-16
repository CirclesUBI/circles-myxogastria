import { Fab, Menu, MenuItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import {
  EDIT_PROFILE_PATH,
  MY_PROFILE_PATH,
  ORGANIZATION_MEMBERS_PATH,
} from '~/routes';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconWobblyCircleSecond } from '~/styles/icons';
import { IconClose, IconMore } from '~/styles/icons';
import { FAQ_URL, MARKETPLACE_URL } from '~/utils/constants';

const useStyles = makeStyles((theme) => {
  const backgroundTheme = (props) => {
    switch (props?.color) {
      case 'turquoise':
        return theme.custom.colors.blue100;
      case 'purple100':
        return theme.custom.colors.purple100;
      case 'white':
        return theme.custom.colors.whiteAlmost;
      default:
        return theme.custom.colors.blue100;
    }
  };
  const backgroundHoverTheme = (props) => {
    switch (props?.color) {
      case 'turquoise':
        return theme.custom.colors.blue200;
      case 'violet':
        return theme.custom.colors.purple200;
      case 'white':
        return theme.custom.colors.whiteAlmost;
      default:
        return theme.custom.colors.blue100;
    }
  };

  return {
    menuNavigation: {
      '&#navigation-floating-menu': {
        background: theme.custom.colors.doveGray,
      },

      '& .MuiMenu-paper.MuiMenu-paper': {
        background: backgroundTheme,
        borderRadius: 0,
        borderBottomRightRadius: '26px',
        width: 'calc(100% - 30px)',
        maxWidth: '385px',
        padding: '17px 0 30px',
      },

      '& .MuiMenu-list': {
        paddingTop: '25px',
      },

      '& .MuiMenuItem-root': {
        padding: '9px 35px',
        marginBottom: '15px',
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
      bottom: '17px',
      color: theme.custom.colors.white,
      position: 'fixed',
      right: '17px',
      zIndex: theme.zIndex.floatingMenuButton,
      width: '52px',
      height: '52px',
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      '&:hover': {
        border: 'none',
        background: 'transparent',
        '& .MuiFab-label': {
          color: (props) =>
            props?.color === 'white'
              ? theme.custom.colors.blue200
              : theme.custom.colors.whiteAlmost,
        },
        '& stop': {
          stopColor: backgroundHoverTheme,
        },
      },
      '& .MuiFab-label': {
        color: (props) =>
          props?.color === 'white'
            ? theme.custom.colors.blue100
            : theme.custom.colors.whiteAlmost,
      },
    },

    buttonIconBackground: {
      position: 'absolute',
      width: '52px',
      height: '52px',
      zIndex: theme.zIndex.floatingMenuButton,

      '& stop': {
        stopColor: backgroundTheme,
      },
    },

    iconMore: {
      zIndex: theme.zIndex.floatingMenuIcon,
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
  };
});

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
        <IconMore className={classes.iconMore} fontSize="large" />
        <IconWobblyCircleSecond className={classes.buttonIconBackground} />
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
          <MenuItem onClick={handleClose}>
            <Link to={ORGANIZATION_MEMBERS_PATH}>
              <Button isOutline>
                {translate('NavigationFloating.linkAddMembers')}
              </Button>
            </Link>
          </MenuItem>
        )}
        <MenuItem onClick={handleClose}>
          <Link to={EDIT_PROFILE_PATH}>
            <Button isOutline>
              {translate('NavigationFloating.linkEditProfile')}
            </Button>
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to={MY_PROFILE_PATH}>
            <Button isOutline>
              {translate('NavigationFloating.linkMyWallets')}
            </Button>
          </Link>
        </MenuItem>
        <ExternalLink href={MARKETPLACE_URL}>
          <MenuItem onClick={handleClose}>
            <Button isOutline>
              {translate('NavigationFloating.linkMarketplace')}
            </Button>
          </MenuItem>
        </ExternalLink>
        <ExternalLink href={FAQ_URL}>
          <MenuItem onClick={handleClose}>
            <Button isOutline>
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
