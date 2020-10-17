import core from '~/services/core';

const cache = {};
const requests = {};
const failed = {};

export default async function resolveTxHash(transactionHash) {
  const requestKey = transactionHash;

  // Check if we're currently requesting the same txHash and return it instead
  // of doing the same request again
  if (requestKey in requests) {
    return requests[requestKey];
  }

  requests[requestKey] = new Promise((resolve) => {
    // If there are not requests to be made, stop here and return results
    if (transactionHash in cache) {
      resolve(cache[transactionHash]);
      return;
    }

    if (transactionHash in failed) {
      resolve(null);
    }

    // Ask the server for user information and store it in the cache
    core.token
      .getPaymentNote(transactionHash)
      .then((paymentNote) => {
        cache[transactionHash] = paymentNote;
        resolve(paymentNote);
      })
      .catch(() => {
        failed[transactionHash] = true;
      });
  });

  return requests[requestKey];
}
