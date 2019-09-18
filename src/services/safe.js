import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const NONCE_NAME = 'nonce';
const SAFE_ADDRESS_NAME = 'safeAddress';

export function generateNonce() {
  const timestamp = new Date().getTime();
  const random = Math.round(Math.random() * 10000000);

  return parseInt(`${timestamp}${random}`, 10);
}

export function getNonce() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasNonce()) {
    return getItem(NONCE_NAME);
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
