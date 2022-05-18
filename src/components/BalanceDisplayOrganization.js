import { Box, Typography } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useUpdateLoop } from '~/hooks/update';
import { checkCurrentBalance, checkTokenState } from '~/store/token/actions';
import { IconCircles } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';

const useStyles = makeStyles((theme) => ({
  box: {
    maxWidth: theme.spacing(70),
    margin: `${theme.spacing(2)}px auto`,
    textAlign: 'center',
    background: theme.custom.colors.whiteAlmost,
    border: `1px solid ${theme.custom.colors.fountainBlue}`,
    borderRadius: '50%',
    boxSizing: 'border-box',
    boxShadow: theme.custom.shadows.gray,
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '174px',
    minHeight: '174px',
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
  smallFont: {
    fontSize: '36px',
    '& .MuiSvgIcon-root': {
      fontSize: '1.8rem',
    },
  },
}));

const BalanceDisplayOrganization = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { token, safe } = useSelector((state) => state);

  useUpdateLoop(async () => {
    await dispatch(checkTokenState());
    await dispatch(checkCurrentBalance());
  });

  const isLoading = token.balance === null && !safe.pendingNonce;
  let tokenBalance;
  let isSmallFont = false;
  if (token.balance !== null) {
    tokenBalance = formatCirclesValue(token.balance);
    isSmallFont = tokenBalance.length >= 10;
  } else {
    tokenBalance = 0;
  }

  return (
    <Box className={classes.box}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Typography
          className={clsx(classes.balance, {
            [classes.smallFont]: isSmallFont,
          })}
        >
          <IconCircles className={classes.balanceIcon} />
          {tokenBalance}
        </Typography>
      )}
    </Box>
  );
};

export default BalanceDisplayOrganization;
