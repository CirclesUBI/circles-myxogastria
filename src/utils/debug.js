/* eslint-disable no-console */

import core from '~/services/core';
import { captureException } from '~/services/sentry';

const { TransferError, RequestError, CoreError } = core.errors;

export function formatErrorMessage(error) {
  // Display internal error message to user for debugging purposes
  let errorMessage = '';

  if (error && error.message) {
    errorMessage = error.message;
    if (error.code) {
      errorMessage += ` (${error.code})`;
    }
    errorMessage = ` [${errorMessage}]`;
  }

  return errorMessage;
}

export default function logError(error) {
  console.group(`[Error] ${error.message.slice(0, 40)}..`);
  console.error(error);

  if (error instanceof RequestError) {
    console.log(error.request);
    captureException(error, error.request);
  } else if (error instanceof TransferError) {
    console.log(error.transfer);
    captureException(error, error.transfer);
  } else if (error instanceof CoreError) {
    console.log(error.code);
    captureException(error);
  } else {
    captureException(error);
  }

  console.groupEnd();
}
