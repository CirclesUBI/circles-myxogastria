import fileDownload from 'js-file-download';

/**
 * Exports a csv file
 */
export function downloadCsvStatement() {
  const csvString = 'letter; number; \n a; 2;';
  const filename = 'export.csv';
  fileDownload(csvString, filename);
  return;
}
