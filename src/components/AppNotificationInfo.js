import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import ExternalLink from '~/components/ExternalLink';
import { IconDragonFly } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  appNotificationInfoContainer: {
    position: 'relative',
    color: 'black',
    padding: '15px 20px',
    background: theme.custom.colors.silverTree,
    marginBottom: '15px',

    '& p': {
      color: theme.custom.colors.grayDarkest,
      fontSize: '11px',
      margin: '5px 0',
    },

    '& a': {
      fontSize: '11px',
      textDecoration: 'underline',
    },
  },

  title: {
    color: theme.custom.colors.grayDarkest,
    fontSize: '12px',
    fontWeight: '500',
    display: 'block',
    marginBottom: '5px',
  },

  dragonflyIconContainer: {
    position: 'absolute',
    top: '-4px',
    right: '-16px',

    '& .MuiSvgIcon-root': {
      width: '56px',
      height: '36px',
    },
  },
}));

const AppNototificationInfo = () => {
  const classes = useStyles();

  return (
    <Box className={classes.appNotificationInfoContainer}>
      <Box className={classes.dragonflyIconContainer}>
        <IconDragonFly />
      </Box>
      <span className={classes.title}>Big changes are coming!</span>
      <p>
        The issuance rate of the Circles UBI will be increased. Instead of 8 CRC
        a day, you will now receive 1 CRC an hour - 24 a day.
      </p>
      <p>
        With the current changes, the hubs and the Circles users worldwide can
        keep the same value of 1 CRC = 1 hour. This acts as an anchor to keep
        the value of UBI more stable across borders, so that people can easily
        connect to each other.
      </p>
      <ExternalLink href="https://circlesubi.medium.com/the-revaluation-of-the-circles-system-c6eea70e767d">
        Read more here!
      </ExternalLink>
    </Box>
  );
};

export default AppNototificationInfo;
