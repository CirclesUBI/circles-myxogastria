/* eslint-disable no-console */

import core from '~/services/core';

const { TransferError, RequestError, CoreError } = core.errors;

export default function logError(error) {
  console.group(`[Error] ${error.message.slice(0, 40)}..`);
  console.error(error);

  if (error instanceof RequestError) {
    console.log(error.request);
  } else if (error instanceof TransferError) {
    console.log(error.transfer);
  } else if (error instanceof CoreError) {
    console.log(error.code);
  }

  console.groupEnd();
}
