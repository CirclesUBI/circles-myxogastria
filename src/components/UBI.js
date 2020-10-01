import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';
import { requestUBIPayout } from '~/store/token/actions';

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

    if (isSameDay || !token.address || !safe.currentAccount) {
      return;
    }

    const checkUBIPayout = async () => {
      // Check if we can collect some UBI
      const payout = await core.token.checkUBIPayout(safe.currentAccount);

      if (
        payout.lt(web3.utils.toBN(web3.utils.toWei(MIN_UBI_PAYOUT, 'ether')))
      ) {
        return;
      }

      // .. and get it!
      await dispatch(requestUBIPayout(payout));

      // Display pending UBI to the user
      dispatch(
        notify({
          text: translate('UBI.infoUbiPayoutReceived', {
            payout: formatCirclesValue(payout, 4),
          }),
          type: NotificationsTypes.INFO,
          timeout: 10000,
        }),
      );
    };

    checkUBIPayout();
  }, [dispatch, safe.currentAccount, token.lastPayoutAt, token.address]);

  return null;
};

export default UBI;
