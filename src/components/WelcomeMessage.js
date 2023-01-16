import { makeStyles } from '@material-ui/core/styles';
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
        <strong>{translate('Dashboard.welcomeMessageTitle')}</strong>
      </span>
      <span>{translate('Dashboard.welcomeMessageBody')}</span>
    </div>
  );
};

WelcomeMessage;

export default WelcomeMessage;
