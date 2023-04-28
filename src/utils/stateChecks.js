import core from '~/services/core';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';

// Wait ms before checking condition again
const LOOP_INTERVAL_DEFAULT = 6000;

// Times condition is checked before its considered a fail
const MAX_ATTEMPTS_DEFAULT = 20;

// Times the method will repeat the request after an error or condition failure
const RETRIES_ON_FAIL_DEFAULT = 3;

// When a request fails wait a few ms before we do it again
const WAIT_AFTER_FAIL_DEFAULT = 5000;

// Error message used to indicate failed condition check
const TRIED_TOO_MANY_TIMES = 'Tried too many times waiting for condition.';

// Helper method to wait for a few milliseconds before we move on
export async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// This helper method resolves as soon as a certain condition was reached and
// throws an exception when too many attempts were made waiting for it.
//
// The `conditionFn` function checks the result of the `requestFn` function.
// For each attempt a request is made and the condition is checked.
//
// Use this if you're waiting for a condition to arrive before you move on with
// other tasks. Do not use this when the used request is somehow writing /
// updating data, this should only serve for reading state and waiting until it
// arrives at the given condition.
export async function loop(
  requestFn,
  conditionFn,
  {
    maxAttempts = MAX_ATTEMPTS_DEFAULT,
    loopInterval = LOOP_INTERVAL_DEFAULT,
  } = {},
) {
  // Count all attempts checking for the condition to arrive
  let attempt = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Get response of request and check for its condition
    const response = await requestFn();

    if (conditionFn(response)) {
      return response;
    } else if (attempt >= maxAttempts) {
      throw new Error(TRIED_TOO_MANY_TIMES);
    } else {
      attempt += 1;
    }

    // Condition did not arrive yet, lets wait and try again ..
    await wait(loopInterval);
  }
}

// This helper method repeats calling a request when it fails or when a
// condition was not reached after some attempts.
//
// Use this method if you want to make a crucial request for creating or
// updating data somewhere. When this request fails, for example because of
// networking issues or server outage, this helper method will try to repeat
// the request for you until it succeeded.
export async function waitAndRetryOnFail(
  requestFn,
  loopFn,
  {
    maxAttemptsOnFail = RETRIES_ON_FAIL_DEFAULT,
    waitAfterFail = WAIT_AFTER_FAIL_DEFAULT,
  } = {},
  onErrorFn,
) {
  // Count all attempts to retry when something failed
  let attempt = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // Make request and wait for response
      const response = await requestFn();

      // Wait for a few seconds until our condition arrives
      await loopFn();

      // Finish when request was successful and condition arrived!
      return response;
    } catch (error) {
      // When there is an error I want to do something
      if (onErrorFn) {
        await onErrorFn();
      }
      // Something went wrong, either the condition did not arrive or the
      // request failed
      if (attempt >= maxAttemptsOnFail) {
        // We tried too often, propagate error and stop here
        throw error;
      }

      // Wait when request failed to prevent calling the request too fast again
      if (error.message !== TRIED_TOO_MANY_TIMES) {
        await wait(waitAfterFail);
      }

      // Lets try again ..
      attempt += 1;
    }
  }
}

export async function isDeployed(address) {
  await loop(
    () => {
      return web3.eth.getCode(address);
    },
    (code) => {
      return code !== '0x';
    },
  );
}

export async function isOrganization(safeAddress) {
  await loop(
    () => {
      return core.organization.isOrganization(safeAddress);
    },
    (isOrganization) => isOrganization,
  );
}

export async function hasEnoughTokens(safeAddress, amount) {
  await loop(
    () => core.token.listAllTokens(safeAddress),
    (tokens) => tokens.length > 0 && tokens[0].amount.eq(amount),
  );
}

export async function isTokenDeployed(safeAddress) {
  await loop(
    () => {
      return core.token.getAddress(safeAddress);
    },
    (address) => {
      return address !== ZERO_ADDRESS;
    },
  );
}
