import { entropyToMnemonic, mnemonicToEntropy } from 'bip39';
import { ethers } from 'ethers';

import ethProvider from '~/services/ethProvider';
import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const PRIVATE_KEY_NAME = 'privateKey';

export function generatePrivateKey() {
  const { privateKey } = ethers.Wallet.createRandom().connect(ethProvider);
  return privateKey;
}

export function getPrivateKey() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasItem(PRIVATE_KEY_NAME)) {
    return getItem(PRIVATE_KEY_NAME);
  } else {
    const privateKey = generatePrivateKey();
    setPrivateKey(privateKey);
    return privateKey;
  }
}

export function setPrivateKey(privateKey) {
  setItem(PRIVATE_KEY_NAME, privateKey);
}

export function removePrivateKey() {
  removeItem(PRIVATE_KEY_NAME);
}

export function getPublicAddress() {
  return getAccount().address;
}

export function fromSeedPhrase(seedPhrase) {
  const restoredKey = mnemonicToEntropy(seedPhrase);
  const privateKey = `0x${restoredKey}`;

  setPrivateKey(privateKey);

  return getPublicAddress();
}

export function toSeedPhrase(privateKey) {
  return entropyToMnemonic(privateKey.slice(2));
}

export function getAccount() {
  const privateKey = getPrivateKey();

  if (privateKey && !ethers.utils.isHexString(privateKey)) {
    throw new Error('Invalid private key');
  }

  return new ethers.Wallet(privateKey).connect(ethProvider);
}
