import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
    zIndex: '1000',
  },
  appBar: {
    opacity: 0,
    '&.MuiPaper-root': {
      transition: 'all 0.15s',
      background: (props) => {
        if (props.isOrganization) {
          return theme.custom.gradients.violet;
        } else {
          return theme.custom.gradients.greenBlueHeader;
        }
      },
      boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.25)',
    },
    height: '64px',
  },
  isScrolled: {
    '&.MuiAppBar-root': {
      background: (props) => {
        if (props.isOrganization) {
          return theme.custom.gradients.violet;
        } else {
          return theme.custom.gradients.greenBlueHeader;
        }
      },
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      opacity: 1,
      transition: 'opacity 0.15s',
    },
  },
  toolbar: {
    minHeight: theme.custom.components.appBarHeight,
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: '10000',
  },
}));

const Header = ({ children, className, ...props }) => {
  const classes = useStyles(props);

  const isScrolled = useCustomScrollTrigger();

  return (
    <div className={classes.headerContainer}>
      <AppBar
        className={clsx(classes.appBar, className, {
          [classes.isScrolled]: isScrolled,
        })}
        color="transparent"
        {...props}
      ></AppBar>
      <Toolbar className={classes.toolbar}>{children}</Toolbar>
    </div>
  );
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Header;
