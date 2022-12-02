/* eslint-disable no-console */

import core from '~/services/core';
import translate from '~/services/locale';
import { captureException } from '~/services/sentry';

const { ErrorCodes, TransferError, RequestError, CoreError } = core.errors;

export function formatErrorMessage(error) {
  // Display internal error message to user for debugging purposes
  let errorMessage = '';

  if (error && error.message) {
    errorMessage = error.message;
    if (error.code) {
      errorMessage += ` (${error.code.toString()})`;
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
    const data = {
      ...error.transfer,
      value: error.transfer.value.toString(),
    };
    console.log(data);
    captureException(error, data);
  } else if (error instanceof CoreError) {
    console.log(error.code);
    captureException(error);
  } else {
    captureException(error);
  }

  console.groupEnd();
}

export function translateErrorForUser(error) {
  let text;
  if (error instanceof CoreError) {
    if (error.code == ErrorCodes.INSUFFICIENT_FUNDS) {
      text = translate('ErrorCodes.CoreErrorInsufficientFunds');
    }
  } else if (error instanceof TransferError) {
    /*eslint-disable no-empty */
  } else if (error instanceof RequestError) {
    /*eslint-enable no-empty */
  }

  return text;
}
