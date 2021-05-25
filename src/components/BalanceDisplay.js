import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Grid, Paper, Typography, Tooltip, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Logo from '~/components/Logo';
import translate from '~/services/locale';
import { ISSUANCE_RATE_MONTH } from '~/utils/constants';
import { IconCircles } from '~/styles/icons';
import { checkCurrentBalance, checkTokenState } from '~/store/token/actions';
import { formatCirclesValue } from '~/utils/format';
import { useUpdateLoop } from '~/hooks/update';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: theme.spacing(70),
    margin: '0 auto',
  },
  grid: {
    '&>*': {
      flexGrow: 0,
      flexBasis: 'auto',
    },
  },
  balance: {
    fontSize: '2.5rem',
    fontWeight: theme.typography.fontWeightRegular,
  },
  balanceIcon: {
    position: 'relative',
    top: 2,
    marginRight: theme.spacing(0.5),
    fontSize: '2rem',
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

  // Token is apparently deployed, wait for the incoming data
  const isLoading =
    (token.balance === null || token.balance === '0') && !safe.pendingNonce;

  return (
    <Tooltip
      arrow
      title={translate('BalanceDisplay.tooltipYourBalance', {
        rate: ISSUANCE_RATE_MONTH,
      })}
    >
      <Paper className={classes.paper} variant="outlined">
        <Box p={2.5}>
          <Grid
            alignItems="center"
            className={classes.grid}
            container
            justify="center"
            spacing={2}
          >
            <Grid item xs>
              <Logo size="small" />
            </Grid>
            <Grid item xs>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <Typography className={classes.balance} component="span">
                  <IconCircles className={classes.balanceIcon} />
                  {token.balance !== null
                    ? formatCirclesValue(token.balance)
                    : 0}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Tooltip>
  );
};

export default BalanceDisplay;
