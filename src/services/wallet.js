import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

import web3 from '~/services/web3';

const PRIVATE_KEY_NAME = 'privateKey';

export function generatePrivateKey() {
  const { privateKey } = web3.eth.accounts.create();
  setItem(PRIVATE_KEY_NAME, privateKey);

  return privateKey;
}

export function hasPrivateKey() {
  return hasItem(PRIVATE_KEY_NAME);
}

export function getPrivateKey() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  return getItem(PRIVATE_KEY_NAME);
}

export function removePrivateKey() {
  removeItem(PRIVATE_KEY_NAME);
}
