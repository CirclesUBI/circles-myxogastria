import { Box } from '@material-ui/core';
import React from 'react';

import HumbleAlert from '~/components/HumbleAlert';

const AppNote = () => {
  return process.env.USER_NOTIFICATION ? (
    <Box my={2}>
      <HumbleAlert>{process.env.USER_NOTIFICATION}</HumbleAlert>
    </Box>
  ) : null;
};

export default AppNote;
