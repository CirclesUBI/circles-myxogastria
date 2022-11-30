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
/*eslint-disable */

export function translateErrorForUser(error) {
  let text;
  // console.log({ error });
  // debugger;

  console.log('translateErrorForUser(error)', translateErrorForUser(error));
  console.log('error.code', error.code);
  console.log('ErrorCodes.INSUFFICIENT_FUNDS', ErrorCodes.INSUFFICIENT_FUNDS);

  console.log('error instanceof CoreError', error instanceof CoreError);

  if (error instanceof CoreError) {
    console.log('Im in if :)');
    if (error.code == ErrorCodes.INSUFFICIENT_FUNDS) {
      text = translate('ErrorCodes.CoreErrorInsufficientFunds');
    }
  } else if (error instanceof TransferError) {
    /*eslint-disable no-empty */
  } else if (error instanceof RequestError) {
    /*eslint-enable no-empty */
  }
  console.log('text2', text);
  /*eslint-enable*/

  return text;
}
