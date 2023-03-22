import fileDownload from 'js-file-download';

const getBalance = (/*dateTime, safe*/) => {
  return 25; // Dummy balance
};

const formatDate = (/*dateTime*/) => {
  return '01.01.2022'; // Dummy date
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
export function downloadCsvStatement(
  accountName,
  safeAddress,
  startDate,
  endDate,
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
  const endBalance = getBalance(endDate, safeAddress);
  const startBalance = getBalance(startDate, safeAddress);
  const demurrage = 2;
  const csvTransactions = ['trans1', 'trans2', 'trans3'];
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
