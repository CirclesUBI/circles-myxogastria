import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { DISCORD_URL, METRI_URL } from '~/utils/constants';

const useStyles = makeStyles(() => ({
  messageContainer: {
    marginTop: '10px',
    textAlign: 'center',
    '& p': {
      marginBottom: '3px',
    },
  },
}));

const ShortMessage = () => {
  const classes = useStyles();

  return (
    <Box className={classes.messageContainer}>
      <Typography align="center" variant="body1">
        {translate('Login.ShortMsgText')}
      </Typography>
      <ExternalLink
        href={METRI_URL}
        style={{ marginBottom: '10px', display: 'block' }}
        variant="body2"
      >
        {METRI_URL}
      </ExternalLink>
      <Typography align="center" variant="body1">
        {translate('Login.ShortMsgText2')}
      </Typography>
      <ExternalLink href={DISCORD_URL} variant="body2">
        {DISCORD_URL}
      </ExternalLink>
    </Box>
  );
};

export default ShortMessage;
