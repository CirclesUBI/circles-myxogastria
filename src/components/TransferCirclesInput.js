import { InputAdornment } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import TransferInput from '~/components/TransferInput';
import { IconCircles } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  input: {
    fontSize: 27,
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
          <IconCircles />
        </InputAdornment>
      }
      type="number"
      {...props}
    />
  );
};

export default TransferCirclesInput;
