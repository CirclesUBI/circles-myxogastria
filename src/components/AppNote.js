import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

import HumbleAlert from '~/components/HumbleAlert';

const useStyles = makeStyles(() => ({
  appNoteContainer: {
    position: 'relative',
  },
}));

const AppNote = () => {
  const classes = useStyles();

  return process.env.USER_NOTIFICATION ? (
    <Box className={classes.appNoteContainer} my={2}>
      <HumbleAlert>{process.env.USER_NOTIFICATION}</HumbleAlert>
    </Box>
  ) : null;
};

export default AppNote;
