import fileDownload from 'js-file-download';
import { DateTime } from 'luxon';

import core from '~/services/core';
import resolveTxHash from '~/services/transfer';
import resolveUsernames from '~/services/username';
import { formatCirclesValue } from '~/utils/format';

const { ActivityFilterTypes } = core.activity;

const getBalance = (/*dateTime, safe*/) => {
  return 25; // Dummy balance
};

const formatDate = (/*dateTime*/) => {
  return '01.01.2022'; // Dummy date
};

const getTransactions = async (safeAddress) => {
  try {
    const { activities /*, lastTimestamp*/ } = await core.activity.getLatest(
      safeAddress,
      ActivityFilterTypes.TRANSFERS,
      40,
    );
    // console.log('CAT --- ', activities, lastTimestamp);
    const transactions = activities.map((activity) => {
      const { to, from, value } = activity.data;
      return {
        to: to,
        from: from,
        valueInFreckles: value,
        txHash: activity.transactionHash,
        date: DateTime.fromSeconds(activity.timestamp),
        negative: from === safeAddress,
      };
    });
    // console.log(transactions);
    return transactions;
  } catch (e) {
    // TODO: HANDLE
    // console.log(e);
  }
};

/**
 * @param {*} transactions
 * @param {*} safeAddress
 * @returns A csv string with line separated transactions in format
 * 'dd.mm.yyyy, Username, 0x00000000000000000000, Transaction message, -123.45'
 */
const formatActivities = async (transactions, safeAddress) => {
  const transactionData = await Promise.all(
    transactions.map(async (transaction) => {
      const { to, from, valueInFreckles, txHash, date } = transaction;
      const message = await resolveTxHash(txHash);
      const otherSafeAddress = to === safeAddress ? from : to;
      const valueSign = from === safeAddress ? '-' : '+';
      const valueInTimeCircles = formatCirclesValue(
        valueInFreckles,
        date,
        2,
        false, // important to not round normal, not down to get even numbers
      );
      return [
        date.toFormat('dd.LL.yyyy').toString(),
        'placeholder name',
        otherSafeAddress,
        message || '-',
        valueSign.concat(valueInTimeCircles),
        '',
      ];
    }),
  );
  // set of unique safes in data
  const otherSafes = [...new Set(transactionData.map((data) => data[2]))];
  // corresponding names by safe
  const namesBySafe = await resolveUsernames(otherSafes);
  // replace placeholder name
  return transactionData.map((data) => {
    const safe = data[2];
    data[1] = namesBySafe[safe].username;
    return data.join(';');
  });
};

const generateCsvContent = (
  accountName,
  safeAddress,
  startDate,
  endDate,
  startBalance,
  endBalance,
  demurrage,
  sumOfTransactions,
  csvTransactions,
) => {
  return [
    'Circles Account Statement',
    '',
    `Account_name; ${accountName}`,
    `Account_safe_address; ${safeAddress}`,
    `Period_start_date"; ${formatDate(startDate)}`,
    `Period_end_date; ${formatDate(endDate)}`,
    '',
    `Balance_on_end_date; ${endBalance}`,
    `Demurrage_during_selected_period; ${demurrage}`,
    `Sum_of_transaction; ${sumOfTransactions}`,
    `Balance_on_start_date; ${startBalance}`,
    '',
    'Transactions_within_period',
    `date; to_or_from_username; to_or_from_safe_address; transfer_note; amount_in_circles`,
    ...csvTransactions,
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
   * filter activity
   * call calc balance
   * call calc demurrage
   * format transactions
   * filename includes dates
   * error handling
   */

  // verify date order - later
  // DateTime.fromISO(lastSeenAt) > DateTime.fromISO(createdAt);

  // get activity
  const transactions = await getTransactions(safeAddress);
  const csvTransactions = await formatActivities(transactions, safeAddress);
  const balanceNow = await core.token.getBalance(safeAddress);
  const endBalance = formatCirclesValue(balanceNow); //getBalance(endDate, safeAddress);
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
    0,
    csvTransactions,
  );
  const filename = 'export.csv';
  //console.log(csvString);
  fileDownload(csvString, filename);
  return;
}
