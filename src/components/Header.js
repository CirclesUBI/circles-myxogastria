import { AppBar, Toolbar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { useCustomScrollTrigger } from '~/hooks/scrollTrigger';

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    position: 'fixed',
    width: '100%',
    height: '64px',
    left: 0,
    zIndex: theme.zIndex.header,
  },
  appBar: {
    pointerEvents: 'none',
    opacity: 0,
    '&.MuiPaper-root': {
      transition: 'all 0.15s',
      background: (props) => {
        if (props.useSpecialWithColorOnScroll) {
          if (props.isOrganization) {
            return theme.custom.gradients.violetHeader;
          }
          return theme.custom.gradients.greenBlueHeader;
        }
        return theme.palette.background.default;
      },
      // boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.25)',
    },
    color: 'transparent',
    height: '64px',
  },
  isScrolled: {
    '&.MuiAppBar-root': {
      background: (props) => {
        if (props.useSpecialWithColorOnScroll) {
          if (props.isOrganization) {
            return theme.custom.gradients.violetHeader;
          }
          return theme.custom.gradients.greenBlueHeader;
        }
        return theme.palette.background.default;
      },
      // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      opacity: 0,
      transition: 'opacity 0.15s',
    },
  },
  toolbar: {
    minHeight: theme.custom.components.appBarHeight,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: theme.zIndex.toolbar,
  },
  darkIcons: {
    '& button, & a.MuiIconButton-root': {
      color: theme.custom.colors.purple100,
      '&:hover': {
        color: theme.custom.colors.purple200,
        background: 'transparent',
      },
    },
  },
  whiteIcons: {
    '& button, & a.MuiIconButton-root': {
      color: theme.custom.colors.purple100,
      '&:hover': {
        color: theme.custom.colors.purple200,
        background: 'transparent',
      },
    },
  },
}));

const Header = ({
  children,
  className,
  hasWhiteIcons,
  isOrganization,
  useSpecialWithColorOnScroll,
  ...props
}) => {
  const classes = useStyles({
    isOrganization,
    useSpecialWithColorOnScroll,
    ...props,
  });

  const isScrolled = useCustomScrollTrigger();

  return (
    <div className={classes.headerContainer}>
      <AppBar
        className={clsx(classes.appBar, className, {
          [classes.isScrolled]: isScrolled,
        })}
        {...props}
      ></AppBar>
      <Toolbar
        className={clsx(classes.toolbar, {
          [classes.whiteIcons]: hasWhiteIcons,
          [classes.darkIcons]: !hasWhiteIcons,
        })}
      >
        {children}
      </Toolbar>
    </div>
  );
};

Header.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hasWhiteIcons: PropTypes.bool,
  isOrganization: PropTypes.bool,
  useSpecialWithColorOnScroll: PropTypes.bool,
};

export default Header;
