import { crcToTc } from '@circles/timecircles';
import fileDownload from 'js-file-download';
import { DateTime } from 'luxon';

import core from '~/services/core';
import resolveTxHash from '~/services/transfer';
import resolveUsernames from '~/services/username';
import web3 from '~/services/web3';
import { formatCirclesValue } from '~/utils/format';

const NUMBER_OF_DECIMALS = 2;

const { ActivityFilterTypes } = core.activity;

const formatDate = (dateTime) => dateTime.toFormat(`dd.LL.yyyy`).toString();

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
    `Period_start_date; ${formatDate(startDate)}`,
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
        NUMBER_OF_DECIMALS,
        false, // important to not round normal, not down to get even numbers
      );
      return [
        formatDate(date),
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

/**
 *
 * @param {*} transactions
 * @param {*} shouldBeInTc
 * @returns
 */
const sumOfTransactions = (transactions, shouldBeInTc = false) => {
  if (shouldBeInTc) {
    return transactions.reduce(
      (acc, tx) =>
        tx.isNegative
          ? acc - tx.valueInTimeCircles
          : acc + tx.valueInTimeCircles,
      0,
    );
  }
  return transactions.reduce(
    (acc, tx) =>
      tx.isNegative
        ? acc - parseFloat(tx.valueInCircles)
        : acc + parseFloat(tx.valueInCircles),
    0,
  );
};

/**
 *
 * @param {*} safeAddress
 * @returns
 */
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
      const valueInCircles = web3.utils.fromWei(value);
      const date = DateTime.fromSeconds(activity.timestamp);
      return {
        to: to,
        from: from,
        valueInFreckles: value,
        valueInCircles: valueInCircles,
        valueInTimeCircles: crcToTc(date, Number(valueInCircles)),
        txHash: activity.transactionHash,
        date: date,
        isNegative: from === safeAddress,
      };
    });
    //  console.log(transactions);
    return transactions;
  } catch (e) {
    // TODO: HANDLE
    // console.log(e);
  }
};

/**
 *
 * @param {*} accountName
 * @param {*} safeAddress
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
export async function downloadCsvStatement(
  accountName,
  safeAddress,
  startDate = DateTime.now(), // TODO
  endDate = DateTime.now(), // TODO
) {
  // Verify date order
  if (startDate > endDate) {
    throw new Error('Invalid date interval');
    // TODO: improve and catch
  }

  // Transactions - TODO: filter on date
  const transactions = await getTransactions(safeAddress);
  const txsNowToEnd = [];
  const txsStartToEnd = transactions;

  // Transaction sums
  const sumCrcEnd = sumOfTransactions(txsNowToEnd);
  const sumTxCrcPeriod = sumOfTransactions(txsStartToEnd);
  const sumTxTcPeriod = sumOfTransactions(txsStartToEnd, true);
  //  console.log({ sumCrcEnd, sumTxCrcPeriod, sumTxTcPeriod });

  // Balances
  const balanceNowCrc = parseFloat(
    web3.utils.fromWei(await core.token.getBalance(safeAddress)),
  );
  const endBalanceCrc = balanceNowCrc - sumCrcEnd;
  const startBalanceCrc = endBalanceCrc - sumTxCrcPeriod;
  //  console.log({ balanceNowCrc, endBalanceCrc, startBalanceCrc });
  const endBalanceTc = crcToTc(endDate, endBalanceCrc.toString());
  const startBalanceTc = crcToTc(startDate, startBalanceCrc.toString());
  const balanceChangeTc = endBalanceTc - startBalanceTc;
  //  console.log({ endBalanceTc, startBalanceTc });

  // Demurrage
  const demurrage = balanceChangeTc - sumTxTcPeriod;
  //  console.log({ balanceChangeTc, demurrage });

  // CSV formatting
  const csvTransactions = await formatActivities(transactions, safeAddress);
  const csvString = generateCsvContent(
    accountName,
    safeAddress,
    startDate,
    endDate,
    startBalanceTc.toFixed(NUMBER_OF_DECIMALS).toString(),
    endBalanceTc.toFixed(NUMBER_OF_DECIMALS).toString(),
    demurrage.toFixed(NUMBER_OF_DECIMALS).toString(),
    sumTxTcPeriod.toFixed(NUMBER_OF_DECIMALS).toString(),
    csvTransactions,
  );
  //  console.log(csvString);

  // File naming
  const dateString = [formatDate(startDate), formatDate(endDate)]
    .join('_-_')
    .replace('.', '-');
  const filename = `Circles_Statement_${accountName}_${dateString}.csv`;

  // Download
  fileDownload(csvString, filename);
  return;
}
