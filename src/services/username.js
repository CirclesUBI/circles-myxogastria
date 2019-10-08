import { resolveUsernameAddresses } from '~/services/core';

const cache = {};

export async function resolveUsernames(addresses) {
  return new Promise(resolve => {
    const result = {};
    const toBeFetched = [];

    addresses.forEach(address => {
      if (address in cache) {
        result[address] = cache[address];
      } else {
        toBeFetched.push(address);
      }
    });

    if (toBeFetched.length === 0) {
      resolve(result);
      return;
    }

    resolveUsernameAddresses(toBeFetched)
      .then(({ data }) => {
        data.forEach(user => {
          cache[user.safeAddress] = user.username;
          result[user.safeAddress] = user.username;
        });
      })
      .catch(() => {
        // Do nothing ..
      })
      .finally(() => {
        resolve(result);
      });
  });
}
