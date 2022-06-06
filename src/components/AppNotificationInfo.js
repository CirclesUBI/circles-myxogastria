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
    background: theme.custom.colors.jaggedIce,
    marginBottom: '15px',

    '& p': {
      color: theme.custom.colors.grayDarkest,
      fontSize: '9px',
      marginBottom: '12px',
    },

    '& a': {
      fontSize: '9px',
    },
  },

  title: {
    color: theme.custom.colors.grayDarkest,
    fontSize: '12px',
    fontWeight: '700',
    paddingLeft: '48px',
    display: 'block',
    marginBottom: '18px',
  },

  dragonflyIconContainer: {
    position: 'absolute',
    top: '4px',
    left: '2px',

    '& .MuiSvgIcon-root': {
      width: '60px',
      height: '37px',
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
      <span className={classes.title}>Save the date!</span>
      <p>
        On the 20th of June, we will enter a new phase of the Circles
        experiment. This will be the biggest change in the Circles UBI system,
        which we&apos;ve had until now.
      </p>
      <p>
        As most changes in life, this won&apos;t be easy, and it won&apos;t be
        advantageous for everyone equally. Luckily, we are all in the same boat
        working on adapting to the changes, and are positive we will be able to
        implement them together in a smooth way!
      </p>
      <ExternalLink href="https://circlesubi.medium.com/the-revaluation-of-the-circles-system-c6eea70e767d">
        Read more here!
      </ExternalLink>
    </Box>
  );
};

export default AppNototificationInfo;
