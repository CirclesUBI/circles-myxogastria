import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React from 'react';

import { iconSelector } from '~/styles/icons';

const useStyles = makeStyles((theme) => {
  return {
    alert: {
      backgroundColor: ({ color }) => color,
      boxShadow: theme.custom.gradients.grayAlert,
      borderRadius: '8px',
      color: theme.custom.colors.whiteAlmost,
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: '400',

      '& .MuiAlert-icon': {
        marginRight: '20px',

        '& svg': {
          color: theme.custom.colors.whiteAlmost,
        },
      },
    },
    alertIcon: {
      color: theme.palette.grey['800'],
      '& path': {
        fill: ({ iconColor }) => iconColor,
      },
    },
  };
});

const HumbleAlert = ({ children, icon, color, iconColor }) => {
  const classes = useStyles({ color, iconColor });
  const IconElement = iconSelector(icon);

  return (
    <Alert
      className={classes.alert}
      icon={<IconElement className={classes.alertIcon} fontSize="inherit" />}
      severity="info"
    >
      <div
        className={classes.alertContent}
        dangerouslySetInnerHTML={{ __html: children }}
      />
    </Alert>
  );
};

HumbleAlert.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
};

export default HumbleAlert;
