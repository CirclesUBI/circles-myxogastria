import fileDownload from 'js-file-download';
import { DateTime } from 'luxon';

import core from '~/services/core';
import resolveTxHash from '~/services/transfer';
import { formatCirclesValue } from '~/utils/format';

const { ActivityFilterTypes } = core.activity;

const getBalance = (/*dateTime, safe*/) => {
  return 25; // Dummy balance
};

const formatDate = (/*dateTime*/) => {
  return '01.01.2022'; // Dummy date
};

const getActivities = async (safeAddress) => {
  try {
    const { activities /*, lastTimestamp*/ } = await core.activity.getLatest(
      safeAddress,
      ActivityFilterTypes.TRANSFERS,
      20,
    );
    // console.log('CAT --- ', activities, lastTimestamp);
    return activities;
  } catch (e) {
    // TODO: HANDLE
    // console.log(e);
  }
};

const formatActivities = async (activities, safeAddress) => {
  return await Promise.all(
    activities.map(async (activity) => {
      const { to, from, value } = activity.data;
      const timestamp = activity.timestamp;
      const message = await resolveTxHash(activity.transactionHash);
      const otherSafeAddress = to === safeAddress ? from : to;
      const valueSign = from === safeAddress ? '-' : '+';
      const date = DateTime.fromSeconds(timestamp);
      const valueInTimeCircles = formatCirclesValue(value, date, 2, false);
      return [
        date.toFormat('dd.LL.yyyy'),
        'Placeholder Name',
        otherSafeAddress,
        message || '-',
        valueSign.concat(valueInTimeCircles),
      ].join(';');
    }),
  );
};

const generateCsvContent = (
  accountName,
  safeAddress,
  startDate,
  endDate,
  startBalance,
  endBalance,
  demurrage,
  csvTransactions,
) => {
  return [
    'Circles Account Statement',
    `account_name; ${accountName}`,
    `account_safe_address; ${safeAddress}`,
    `period_start_date"; ${formatDate(startDate)}`,
    `period_end_date; ${formatDate(endDate)}`,
    `balance_on_end_date; ${endBalance}`,
    `demurrage_during_selected_period, ${demurrage}`,
    `date; to_or_from_username; to_or_from_safe_address; tranfer_note, amount_in_circles`,
    ...csvTransactions,
    `balance_on_start_date; ${startBalance}`,
  ].join('\n');
};

/**
 * Exports account statement as csv file
 */
export async function downloadCsvStatement(
  accountName,
  safeAddress,
  startDate = DateTime.now(),
  endDate = DateTime.now(),
) {
  /* TODO:
   * verify date order
   * get activity
   * filter activity
   * call calc balance
   * call calc demurrage
   * format transactions
   * filename includes dates
   */

  // verify date order - later
  // DateTime.fromISO(lastSeenAt) > DateTime.fromISO(createdAt);

  // get activity
  const activities = await getActivities(safeAddress);
  const csvTransactions = await formatActivities(activities, safeAddress);
  // console.log(csvTransactions);

  const endBalance = getBalance(endDate, safeAddress);
  const startBalance = getBalance(startDate, safeAddress);
  const demurrage = 2;
  const csvString = generateCsvContent(
    accountName,
    safeAddress,
    startDate,
    endDate,
    startBalance,
    endBalance,
    demurrage,
    csvTransactions,
  );
  const filename = 'export.csv';
  fileDownload(csvString, filename);
  return;
}
