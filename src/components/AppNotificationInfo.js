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
    background: theme.custom.colors.finn,
    marginBottom: '15px',
    marginTop: '15px',

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
      <span className={classes.title}>Numbers are getting bigger!</span>
      <p>
        We are switching from displaying inflation to showing balances with a
        demurrage or decay rate of CRC based on our new issuance rate.
      </p>
      <p>
        Based on this, your current balance is going to change as well. If you
        were holding 50 CRC you will now see 150 CRC. If you had 2000 you will
        have 6000. Basically, your balance will triple.
      </p>
      <ExternalLink href="https://circlesubi.medium.com/the-revaluation-of-the-circles-system-c6eea70e767d">
        Read more here!
      </ExternalLink>
    </Box>
  );
};

export default AppNototificationInfo;
