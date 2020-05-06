import core from '~/services/core';
import web3 from '~/services/web3';
import { ZERO_ADDRESS } from '~/utils/constants';

const LOOP_INTERVAL = 1000;

async function loop(request, condition) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await request();

        if (condition(response)) {
          clearInterval(interval);
          resolve(response);
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
