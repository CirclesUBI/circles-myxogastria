import PropTypes from 'prop-types';
import React from 'react';
import { Drawer, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import ExternalLinkList from '~/components/ExternalLinkList';
import LocaleSelector from '~/components/LocaleSelector';

const useStyles = makeStyles((theme) => ({
  navigation: {
    width: theme.custom.navigationWidth,
    flexShrink: 0,
  },
  navigationPaper: {
    width: theme.custom.navigationWidth,
  },
}));

const Navigation = ({ isExpanded, ...props }) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      className={classes.navigation}
      classes={{
        paper: classes.navigationPaper,
      }}
      open={isExpanded}
      variant="persistent"
      {...props}
    >
      <Button component={Link} to="/receive">
        My QR
      </Button>

      <Button component={Link} to="/activities">
        Activity Log
      </Button>

      <Button component={Link} to="/send">
        Send Circles
      </Button>

      <Button component={Link} to="/settings/keys">
        Add Device
      </Button>

      <Button component={Link} to="/settings/keys/export">
        Export Seed Phrase
      </Button>

      <LocaleSelector />
      <ExternalLinkList />
    </Drawer>
  );
};

Navigation.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

export default Navigation;
