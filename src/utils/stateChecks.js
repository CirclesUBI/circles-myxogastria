import core from '~/services/core';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';
import logError from '~/utils/debug';

const LOOP_INTERVAL = 6000;
const MAX_ATTEMPTS = 20;
const MAX_ATTEMPTS_RETRY_ON_FAIL = 6;

async function loop(request, condition) {
  return new Promise((resolve, reject) => {
    let attempt = 0;

    const interval = setInterval(async () => {
      try {
        const response = await request();
        attempt += 1;

        if (condition(response)) {
          clearInterval(interval);
          resolve(response);
        } else if (attempt > MAX_ATTEMPTS) {
          throw new Error('Tried too many times waiting for condition');
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, LOOP_INTERVAL);
  });
}

async function waitAndRetryOnFail(request, condition) {
  let attempt = 0;
  let conditionResult = false;
  while (conditionResult === false && attempt <= MAX_ATTEMPTS_RETRY_ON_FAIL) {
    try {
      attempt += 1;
      const response = await request();
      conditionResult = await condition();
      if (conditionResult === true) {
        return response;
      }
    } catch (error) {
      conditionResult = false;
      logError(error);
    }
  }
  if (attempt === MAX_ATTEMPTS_RETRY_ON_FAIL) {
    throw Error(
      'Tried too many times reattempting the request. We may be experiencing networking problems.',
    );
  }
}

export async function deployOrganization(safeAddress) {
  await waitAndRetryOnFail(
    () => {
      return core.organization.deploy(safeAddress);
    },
    () => {
      return isOrganization(safeAddress);
    },
  );
}

export default async function isDeployed(address) {
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

export async function hasEnoughBalance(safeAddress, estimate) {
  await loop(
    () => {
      return web3.eth.getBalance(safeAddress);
    },
    (balance) => {
      return balance >= estimate;
    },
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
