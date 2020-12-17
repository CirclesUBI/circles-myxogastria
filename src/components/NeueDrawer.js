import React from 'react';
import PropTypes from 'prop-types';
import { Container, SwipeableDrawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    borderRadius: theme.spacing(2, 2, 0, 0),
  },
}));

const NeueDrawer = ({ onOpen, onClose, open, children }) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      anchor="bottom"
      classes={{
        paper: classes.drawerPaper,
      }}
      disableBackdropTransition={!iOS}
      disableDiscovery
      disableSwipeToOpen
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <Container disableGutters maxWidth="sm">
        {children}
      </Container>
    </SwipeableDrawer>
  );
};

NeueDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default NeueDrawer;
