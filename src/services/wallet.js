import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

import web3 from '~/services/web3';

const PRIVATE_KEY_NAME = 'privateKey';

function generatePrivateKey() {
  const { privateKey } = web3.eth.accounts.create();
  setItem(PRIVATE_KEY_NAME, privateKey);

  return privateKey;
}

function getPrivateKey() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(PRIVATE_KEY_NAME)) {
    return getItem(PRIVATE_KEY_NAME);
  } else {
    const privateKey = generatePrivateKey();
    setItem(PRIVATE_KEY_NAME, privateKey);
    return privateKey;
  }
}

export function removePrivateKey() {
  removeItem(PRIVATE_KEY_NAME);
}

export function getPublicAddress() {
  const privateKey = getPrivateKey();

  if (!web3.utils.isHexStrict(privateKey)) {
    throw new Error('Invalid private key');
  }

  const { address } = web3.eth.accounts.privateKeyToAccount(privateKey);

  return address;
}
