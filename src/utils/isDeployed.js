import core from '~/services/core';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';

const LOOP_INTERVAL = 3000;
const MAX_ATTEMPTS = 20;

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

export async function isOrganizationFunded(safeAddress) {
  await loop(
    () => {
      return core.organization.isFunded(safeAddress);
    },
    (isFunded) => isFunded,
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
