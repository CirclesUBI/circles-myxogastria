import { HDKey } from 'ethereum-cryptography/hdkey';
import {
  generateMnemonic,
  mnemonicToSeedSync,
} from 'ethereum-cryptography/bip39';
import { wordlist } from 'ethereum-cryptography/bip39/wordlists/english';

import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';
import web3 from '~/services/web3';

const LOCK_NAME = 'keystoreJsonV3';

let privateKey = null;

export function hasWallet() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }
  return hasItem(LOCK_NAME);
}

export function unlockWallet(password) {
  if (!hasWallet()) {
    throw new Error('No wallet found');
  }

  const keystoreJsonV3 = JSON.parse(getItem(LOCK_NAME));
  const account = web3.eth.accounts.decrypt(keystoreJsonV3, password);
  privateKey = account.privateKey;
  return account.address;
}

export function generateNewMnemonic() {
  return generateMnemonic(wordlist);
}

export function createWallet(mnemonic, password) {
  const hdKey = HDKey.fromMasterSeed(mnemonicToSeedSync(mnemonic));
  privateKey = `0x${hdKey.privateKey.toString('hex')}`;

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const keystoreJsonV3 = account.encrypt(password);
  setItem(LOCK_NAME, JSON.stringify(keystoreJsonV3));

  return account.address;
}

export function removePrivateKey() {
  privateKey = null;
}

export function burnWallet() {
  removePrivateKey();
  removeItem(LOCK_NAME);
}

export function getAccount() {
  if (!privateKey) {
    return;
  }

  return web3.eth.accounts.privateKeyToAccount(privateKey);
}
