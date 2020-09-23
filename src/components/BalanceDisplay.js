import React from 'react';
import { Grid, Paper, Typography, Tooltip, Box } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Logo from '~/components/Logo';
import core from '~/services/core';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { ISSUANCE_RATE_MONTH, ZERO_ADDRESS } from '~/utils/constants';
import { IconCircles } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';

const { ActivityTypes } = core.activity;

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
  const classes = useStyles();
  const { token, safe, activity } = useSelector((state) => state);

  // Token is apparently deployed, wait for the incoming data
  const isLoading =
    (token.balance === null || token.balance === '0') && !safe.pendingNonce;

  // Add value changes based on pending activities
  const pendingValueDiff = activity.activities.reduce((acc, activity) => {
    if (!activity.isPending) {
      return acc;
    }

    if (
      activity.type === ActivityTypes.TRANSFER &&
      activity.data.from === ZERO_ADDRESS
    ) {
      // UBI payout
      return acc.add(web3.utils.toBN(activity.data.value));
    } else if (
      activity.type === ActivityTypes.HUB_TRANSFER &&
      activity.data.to === safe.currentAccount
    ) {
      // Received Circles
      return acc.add(web3.utils.toBN(activity.data.value));
    } else if (
      activity.type === ActivityTypes.HUB_TRANSFER &&
      activity.data.from === safe.currentAccount
    ) {
      // Sent Circles
      return acc.sub(web3.utils.toBN(activity.data.value));
    }

    return acc;
  }, new web3.utils.BN());

  // Add pending value changes to the current one
  const currentValue = token.balance
    ? web3.utils.toBN(token.balance)
    : new web3.utils.BN();

  const mixedValue = currentValue.add(pendingValueDiff);

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
                  {token.balance !== null ? formatCirclesValue(mixedValue) : 0}
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
