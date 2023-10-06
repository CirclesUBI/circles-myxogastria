import { Alert, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { iconSelector } from '~/styles/icons';

const useStyles = makeStyles((theme) => {
  return {
    alert: {
      backgroundColor: ({ color }) => color,
      boxShadow: theme.custom.gradients.grayAlert,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      '& .MuiAlert-icon': {
        marginRight: '20px',
        '& svg': {
          color: theme.custom.colors.whiteAlmost,
        },
      },
    },
    alertHtmlChildren: {
      '& a': {
        textDecoration: 'none',
        color: theme.custom.colors.whiteAlmost,
        '&:hover': {
          textDecoration: 'underline',
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

const HumbleAlert = ({
  children,
  icon,
  color,
  iconColor,
  parseHtml = false,
}) => {
  const classes = useStyles({ color, iconColor });
  const IconElement = iconSelector(icon);

  return (
    <Alert
      className={classes.alert}
      icon={<IconElement className={classes.alertIcon} fontSize="inherit" />}
      severity="info"
    >
      {parseHtml && (
        <Typography
          className={classes.alertHtmlChildren}
          classes={{ root: 'body4_white' }}
          dangerouslySetInnerHTML={{ __html: children }}
          variant="body4"
        />
      )}
      {!parseHtml && children}
    </Alert>
  );
};

HumbleAlert.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  parseHtml: PropTypes.bool,
};

export default HumbleAlert;
