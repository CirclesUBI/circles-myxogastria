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
      value: error.transfer.value
        ? error.transfer.value.toString()
        : 'undefined',
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
    } else if (error.code == ErrorCodes.SAFE_NOT_FOUND) {
      //  error: `Could not find Safe with address ${safeAddress}`,
      text = error.message;
    } else if (error.code == ErrorCodes.INVALID_OPTIONS) {
      text = `${error.message}. ${translate('ErrorCodes.GeneralErrorMessage')}`;
    } else {
      text = `${error.message}. ${translate('ErrorCodes.GeneralErrorMessage')}`;
    }
  } else {
    text = `${error.message}. ${translate('ErrorCodes.GeneralErrorMessage')}`;
  }

  return text;
}
