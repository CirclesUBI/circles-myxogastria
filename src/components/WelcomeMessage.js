import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import translate from '~/services/locale';

const useStyles = makeStyles(() => ({
  textSendConfirmationContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    '& span': {
      display: 'block',
    },
  },
}));

const WelcomeMessage = () => {
  const classes = useStyles();

  return (
    <div className={classes.textSendConfirmationContainer}>
      <Typography classes={{ root: 'body4_gradient_purple' }} variant="body4">
        <strong>{translate('Welcome.welcomeMessageTitle')}</strong>
      </Typography>
      <Typography classes={{ root: 'body4_gradient_purple' }} variant="body4">
        {translate('Welcome.welcomeMessageBody')}
      </Typography>
    </div>
  );
};

export default WelcomeMessage;
