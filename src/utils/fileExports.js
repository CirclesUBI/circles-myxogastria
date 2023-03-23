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

/**
 * Generates a csv string including line breaks based on input strings
 * @param {string} accountName The name of the exporting account
 * @param {string} safeAddress The corresponding safe address
 * @param {string} startDate Starting date of period to export
 * @param {string} endDate Ending date of period to export
 * @param {string} startBalance Start balance
 * @param {string} endBalance End balance
 * @param {string} demurrage Demurrage
 * @param {string} sumOfTransactions Sum of transactions in the specified period
 * @param {string[]} csvTransactions List of csv strings per transaction in the specified period
 * @returns A string containing the complete csv content of an account statement
 */
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
    `Period_start_date; ${startDate}`,
    `Period_end_date; ${endDate}`,
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
 * Generates an array of csv formatted strings for given transactions
 * @param {Object[]} transactions an array of transactions in the same format as from getTransactions()
 * @param {string} safeAddress the safe address of the common sender/receiver of the transactions
 * @returns An array of csv strings with line separated transactions in format
 * 'dd.mm.yyyy, Username, 0x00000000000000000000, Transaction message, -123.45'
 */
const formatTransactions = async (transactions, safeAddress) => {
  const transactionData = await Promise.all(
    transactions.reverse().map(async (transaction) => {
      const { to, from, valueInFreckles, txHash, date } = transaction;
      const message = await resolveTxHash(txHash);
      const otherSafeAddress = to === safeAddress ? from : to;
      const valueSign = from === safeAddress ? '-' : '+';
      const valueInTimeCircles = formatCirclesValue(
        valueInFreckles,
        date,
        NUMBER_OF_DECIMALS,
        false, // important to round normal, not down to get even numbers
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
 * Calculates the sum of given transactions in CRC (default) or TC
 * @param {Object[]} transactions an array of transactions in the same format as from getTransactions()
 * @param {boolean} shouldBeInTc boolean flag specifying if sum should be in TimeCircles (default is CRC)
 * @returns a sum of all transaction values in float format
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
 * Fetching and compiling a list transaction data objects
 * @param {string} safeAddress
 * @returns an array of Objects representing transaction with attributes:
 * {to, from, valueInFreckles, valueInCircles, valueInTimeCircles, txHash, date, isNegative}
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
 * Downloads a csv file with transaction specifications, sum of transactions, demurrage,
 * start balance and end balance for specified account and period in time for a specific account.
 * Downloaded file is similar to a bank statement.
 * @param {string} accountName Name of the account in the export (only used for text)
 * @param {string} safeAddress Safe address of account in question (to fetch data)
 * @param {DateTime} startDate Start date of export period
 * @param {DateTime} endDate End date of export period
 * @returns nothing
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
  const csvTransactions = await formatTransactions(transactions, safeAddress);
  const csvString = generateCsvContent(
    accountName,
    safeAddress,
    formatDate(startDate),
    formatDate(endDate),
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
