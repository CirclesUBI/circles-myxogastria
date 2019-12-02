/* eslint-disable no-console */

import core from '~/services/core';

const { RequestError, CoreError } = core.errors;

export default function logError(error) {
  console.group(`[Error] ${error.message.slice(0, 20)}..`);
  console.error(error);

  if (error instanceof RequestError) {
    console.log(error.request);
  } else if (error instanceof CoreError) {
    console.log(error.code);
  }

  console.groupEnd();
}
