import { InputAdornment } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import TransferInput from '~/components/TransferInput';
import { fontSizeLargest } from '~/styles/fonts';
import { IconCircles } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  input: {
    fontSize: `${fontSizeLargest}px`,
  },
  icon: {
    fontSize: '1.3rem',
  },
}));

const TransferCirclesInput = (props) => {
  const classes = useStyles();

  return (
    <TransferInput
      className={classes.input}
      inputProps={{
        min: 0,
      }}
      startAdornment={
        <InputAdornment position="start">
          <IconCircles className={classes.icon} />
        </InputAdornment>
      }
      type="number"
      {...props}
    />
  );
};

export default TransferCirclesInput;
