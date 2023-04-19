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
      <span>
        <strong>{translate('Welcome.welcomeMessageTitle')}</strong>
      </span>
      <span>{translate('Welcome.welcomeMessageBody')}</span>
    </div>
  );
};

export default WelcomeMessage;
