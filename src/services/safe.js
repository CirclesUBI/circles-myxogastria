import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const NONCE_NAME = 'nonce';
const SAFE_ADDRESS_NAME = 'safeAddress';
const SAFE_CURRENT_ACCOUNT = 'currentAccount';

export const MAX_NONCE = 10000;

export function generateRandomNonce() {
  return Math.round(Math.random() * MAX_NONCE);
}

// Returns a deterministic CREATE2 nonce to predict a to-be-deployed Safe
// address
export function generateDeterministicNonce(address) {
  return parseInt(address.slice(30), 16);
}

// Returns a deterministic CREATE2 nonce from a string to predict a
// to-be-deployed Safe address. This is useful for generating nonces from
// usernames.
// Using simple insecure string hash https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
export function generateDeterministicNonceFromName(str) {
  const charCodeStr = str.split('').reduce((nonce, char) => {
    const code = char.charCodeAt();
    nonce = (nonce << 5) - nonce + code;
    return nonce & nonce;
  }, '');

  return Math.abs(charCodeStr);
}

export function getNonce() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasNonce()) {
    return parseInt(getItem(NONCE_NAME), 10);
  }

  return null;
}

export function hasNonce() {
  return hasItem(NONCE_NAME);
}

export function setNonce(nonce) {
  setItem(NONCE_NAME, nonce);
}

export function removeNonce() {
  removeItem(NONCE_NAME);
}

export function getSafeAddress() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasSafeAddress()) {
    return getItem(SAFE_ADDRESS_NAME);
  }

  return null;
}

export function hasSafeAddress() {
  return hasItem(SAFE_ADDRESS_NAME);
}

export function setSafeAddress(safeAddress) {
  setItem(SAFE_ADDRESS_NAME, safeAddress);
}

export function removeSafeAddress() {
  removeItem(SAFE_ADDRESS_NAME);
}

export function getCurrentAccount() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasCurrentAccount()) {
    return getItem(SAFE_CURRENT_ACCOUNT);
  }

  return null;
}

export function hasCurrentAccount() {
  return hasItem(SAFE_CURRENT_ACCOUNT);
}

export function setCurrentAccount(safeAddress) {
  setItem(SAFE_CURRENT_ACCOUNT, safeAddress);
}

export function removeCurrentAccount() {
  removeItem(SAFE_CURRENT_ACCOUNT);
}
