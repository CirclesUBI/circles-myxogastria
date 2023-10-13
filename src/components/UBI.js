import { Typography } from '@mui/material';
import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { requestUBIPayout } from '~/store/token/actions';
import { formatCirclesValue } from '~/utils/format';

const MIN_UBI_PAYOUT = '0.5';

const UBI = () => {
  const dispatch = useDispatch();
  const { safe, token } = useSelector((state) => state);

  useEffect(() => {
    // We only collect UBI once every day
    const isSameDay = DateTime.local().hasSame(
      DateTime.fromISO(token.lastPayoutAt),
      'day',
    );

    if (
      isSameDay ||
      !token.address ||
      !safe.currentAccount ||
      safe.isOrganization
    ) {
      return;
    }

    const checkUBIPayout = async () => {
      // Check if we can collect some UBI
      const payout = await core.token.checkUBIPayout(safe.currentAccount);

      if (
        payout.lt(ethers.BigNumber.from(core.utils.toFreckles(MIN_UBI_PAYOUT)))
      ) {
        return;
      }

      // .. and get it!
      await dispatch(requestUBIPayout(payout));

      const text = (
        <span
          dangerouslySetInnerHTML={{
            __html: translate('UBI.infoUbiPayoutReceived', {
              payout: formatCirclesValue(payout, Date.now(), 4),
            }),
          }}
        />
      );

      // Display pending UBI to the user
      dispatch(
        notify({
          text: (
            <Typography
              classes={{ root: 'body4_gradient_purple' }}
              variant="body4"
            >
              {text}
            </Typography>
          ),
          type: NotificationsTypes.SPECIAL,
          timeout: 10000,
        }),
      );
    };

    checkUBIPayout();
  }, [
    dispatch,
    safe.currentAccount,
    safe.isOrganization,
    token.address,
    token.lastPayoutAt,
  ]);

  return null;
};

export default UBI;
