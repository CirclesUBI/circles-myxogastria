import { CircularProgress } from '@mui/material';
import { Box, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { TOKENS_PATH } from '~/routes';

import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import { checkCurrentBalance, checkTokenState } from '~/store/token/actions';
import { IconCircles } from '~/styles/icons';
import { ISSUANCE_RATE_MONTH } from '~/utils/constants';
import { formatCirclesValue } from '~/utils/format';

const useStyles = makeStyles((theme) => ({
  box: {
    textAlign: 'center',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '6.5rem',
  },
  balanceIcon: {
    position: 'relative',
    top: 2,
    marginRight: theme.spacing(0.5),
    fontSize: '2.3rem',
  },
  balanceUnderline: {
    '&:hover': {
      textDecoration: 'underline',
      textDecorationColor: theme.custom.colors.violet,
    },
  },
}));

const BalanceDisplay = ({ underlineAtHover = true }) => {
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
  const tokenBalance =
    token.balance !== null ? formatCirclesValue(token.balance) : 0;
  const tooltipText = safe.isOrganization
    ? translate('BalanceDisplay.tooltipSharedWalletBalance')
    : translate('BalanceDisplay.tooltipYourBalance', {
        rate: ISSUANCE_RATE_MONTH / 30,
      });

  return (
    <Tooltip arrow title={tooltipText}>
      <Box className={classes.box}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Typography
            className={underlineAtHover && classes.balanceUnderline}
            variant="balance1"
          >
            <Link to={TOKENS_PATH}>
              <IconCircles className={classes.balanceIcon} />
              {tokenBalance}
            </Link>
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

BalanceDisplay.propTypes = {
  underlineAtHover: PropTypes.bool,
};

export default BalanceDisplay;
