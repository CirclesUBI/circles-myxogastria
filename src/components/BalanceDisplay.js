import { Box, Typography } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useUpdateLoop } from '~/hooks/update';
import { checkCurrentBalance, checkTokenState } from '~/store/token/actions';
import { IconCircles } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';

const useStyles = makeStyles((theme) => ({
  box: {
    textAlign: 'center',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: '48px',
    fontWeight: theme.typography.fontWeightRegular,
    padding: '20px',
  },
  balanceIcon: {
    position: 'relative',
    top: 2,
    marginRight: theme.spacing(0.5),
    fontSize: '2.3rem',
  },
}));

const BalanceDisplay = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { token, safe } = useSelector((state) => state);

  useUpdateLoop(async () => {
    await dispatch(checkTokenState());
    await dispatch(checkCurrentBalance());
  });

  const isLoading = token.balance === null && !safe.pendingNonce;
  let tokenBalance;
  if (token.balance !== null) {
    tokenBalance = formatCirclesValue(token.balance);
  } else {
    tokenBalance = 0;
  }

  return (
    <Box className={classes.box}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Typography className={classes.balance}>
          <IconCircles className={classes.balanceIcon} />
          {tokenBalance}
        </Typography>
      )}
    </Box>
  );
};

export default BalanceDisplay;
