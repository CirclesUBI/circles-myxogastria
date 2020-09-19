import React from 'react';
import { Box } from '@material-ui/core';

import HumbleAlert from '~/components/HumbleAlert';
import translate from '~/services/locale';

const AppNote = () => {
  return process.env.STAGING_NOTIFICATION || process.env.EOL_NOTIFICATION ? (
    <Box my={2}>
      <HumbleAlert>
        {process.env.STAGING_NOTIFICATION
          ? translate('default.bodyStagingNotification')
          : translate('default.bodyEOLNotification')}
      </HumbleAlert>
    </Box>
  ) : null;
};

export default AppNote;
