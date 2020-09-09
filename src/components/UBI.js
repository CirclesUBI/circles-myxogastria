import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';
import { requestUBIPayout } from '~/store/token/actions';

const MIN_UBI_PAYOUT = '0.5';

const UBI = (props, context) => {
  const dispatch = useDispatch();
  const { safe, token } = useSelector((state) => state);

  useEffect(() => {
    // We only collect UBI once every day
    const isSameDay = DateTime.local().hasSame(
      DateTime.fromMillis(token.lastPayout),
      'day',
    );

    if (isSameDay || !token.address) {
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

      // Display pending UBI to the user
      dispatch(
        notify({
          text: context.t('Dashboard.ubiPayoutReceived', {
            payout: formatCirclesValue(payout, 4),
          }),
          type: NotificationsTypes.INFO,
          timeout: 10000,
        }),
      );

      // .. and get it!
      await dispatch(requestUBIPayout());
    };

    checkUBIPayout();
  }, [token.address]);

  return null;
};

UBI.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default UBI;
