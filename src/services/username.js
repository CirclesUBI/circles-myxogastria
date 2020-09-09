import core from '~/services/core';

const cache = {};

export default async function resolveUsernames(addresses) {
  return new Promise((resolve) => {
    const result = {};
    const toBeFetched = [];

    addresses.forEach((address) => {
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

    core.user
      .resolve(toBeFetched)
      .then(({ data }) => {
        data.forEach((user) => {
          cache[user.safeAddress] = user.username;
          result[user.safeAddress] = user.username;
        });

        resolve(result);
      })
      .catch(() => {
        // Do nothing ..
        resolve(result);
      });
  });
}
