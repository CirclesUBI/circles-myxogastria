import core from '~/services/core';

const cache = {};
const requests = {};

const requested = [];
const failed = [];

export default async function resolveUsernames(addresses) {
  const requestKey = addresses.sort().join('');

  addresses.forEach((address) => {
    requested.push(address);
  });

  // Check if we're currently requesting the same addresses and return it
  // instead of doing the same request again
  if (requestKey in requests) {
    return requests[requestKey];
  }

  // Check if this request is already a subset of another
  const supersetRequest = Object.keys(requests).find((key) => {
    return key.includes(requestKey);
  });

  if (supersetRequest) {
    return supersetRequest;
  }

  // Otherwise, do the actual request
  requests[requestKey] = new Promise((resolve) => {
    const result = {};
    const toBeFetched = [];

    // Prepare request
    addresses.forEach((address) => {
      if (address in cache) {
        // Use result from cache to not ask server again
        result[address] = cache[address];
      } else if (!failed.includes[address]) {
        // Request if we haven't checked yet (exclude failed requests)
        toBeFetched.push(address);
      }
    });

    // If there are not requests to be made, stop here and return results
    if (toBeFetched.length === 0) {
      resolve(result);
      return;
    }

    const checkAndReturnResults = (result) => {
      // Mark unresolved addresses as failed
      toBeFetched.forEach((address) => {
        if (!(address in result)) {
          failed.push(address);
        }
      });

      // Finally return resolved addresses
      resolve(result);
    };

    // Ask the server for user information and store it in the cache
    core.user
      .resolve(toBeFetched)
      .then(({ data }) => {
        data.forEach((user) => {
          cache[user.safeAddress] = user;
          result[user.safeAddress] = user;
        });

        checkAndReturnResults(result);
      })
      .catch(() => {
        checkAndReturnResults(result);
      });
  });

  return requests[requestKey];
}
