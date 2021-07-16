import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React from 'react';

import { IconAlert } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  alert: {
    backgroundColor: theme.palette.grey['100'],
    color: theme.palette.grey['800'],
    fontWeight: theme.typography.fontWeightLight,
  },
  alertIcon: {
    color: theme.palette.grey['800'],
  },
}));

const HumbleAlert = ({ children }) => {
  const classes = useStyles();

  return (
    <Alert
      className={classes.alert}
      icon={<IconAlert className={classes.alertIcon} fontSize="inherit" />}
      severity="info"
    >
      {children}
    </Alert>
  );
};

HumbleAlert.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HumbleAlert;
