import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { formatCirclesValue } from '~/utils/format';
import { requestUBIPayout } from '~/store/token/actions';

const UBI = (props, context) => {
  const dispatch = useDispatch();

  const safe = useSelector(state => state.safe);
  const token = useSelector(state => state.token);

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
      const payout = await core.token.checkUBIPayout(safe.address);

      if (payout.isZero()) {
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
