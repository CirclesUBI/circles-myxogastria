import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const NONCE_NAME = 'nonce';

function generateNonce() {
  return new Date().getTime();
}

// eslint-disable-next-line no-unused-vars
function getNonce() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(NONCE_NAME)) {
    return getItem(NONCE_NAME);
  } else {
    const nonce = generateNonce();
    setItem(NONCE_NAME, nonce);
    return nonce;
  }
}

// eslint-disable-next-line no-unused-vars
export function predictSafeAddress(walletAddress) {
  // @TODO: Call core method here, something like:
  // const nonce = getNonce();
  // return predict(walletAddress, nonce);
  return null;
}

export function removeNonce() {
  removeItem(NONCE_NAME);
}
