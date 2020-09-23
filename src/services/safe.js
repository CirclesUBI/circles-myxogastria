import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const NONCE_NAME = 'nonce';
const DEPRECATED_SAFE_ADDRESS_NAME = 'safeAddress'; // <= 0.6.4
const SAFE_ADDRESS_NAME_V2 = 'safeAddress-v2'; // >= 1.0.0
const SAFE_CURRENT_ACCOUNT = 'currentAccount';

export const MAX_NONCE = 10000;

export function generateRandomNonce() {
  return Math.round(Math.random() * MAX_NONCE);
}

export function generateDeterministicNonce(address) {
  // Returns a deterministic CREATE2 nonce to predict a to-be-deployed Safe
  // address
  return parseInt(address.slice(30), 16);
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
    return getItem(SAFE_ADDRESS_NAME_V2);
  }

  return null;
}

export function hasSafeAddress() {
  return hasItem(SAFE_ADDRESS_NAME_V2);
}

export function setSafeAddress(safeAddress) {
  setItem(SAFE_ADDRESS_NAME_V2, safeAddress);
}

export function removeSafeAddress() {
  removeItem(SAFE_ADDRESS_NAME_V2);
}

export function getCurrentAccount() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  // Legacy: Move deprecated safeAddress (<=0.6.4) to currentAccount
  if (hasItem(DEPRECATED_SAFE_ADDRESS_NAME)) {
    setCurrentAccount(getItem(DEPRECATED_SAFE_ADDRESS_NAME));
    removeItem(DEPRECATED_SAFE_ADDRESS_NAME);
  }

  if (hasCurrentAccount()) {
    return getItem(SAFE_CURRENT_ACCOUNT);
  }

  return null;
}

export function hasCurrentAccount() {
  if (hasItem(DEPRECATED_SAFE_ADDRESS_NAME)) {
    return true;
  }

  return hasItem(SAFE_CURRENT_ACCOUNT);
}

export function setCurrentAccount(safeAddress) {
  setItem(SAFE_CURRENT_ACCOUNT, safeAddress);
}

export function removeCurrentAccount() {
  removeItem(SAFE_CURRENT_ACCOUNT);
}
