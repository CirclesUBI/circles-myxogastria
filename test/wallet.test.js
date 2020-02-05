import web3 from '~/services/web3';

import {
  fromSeedPhrase,
  generatePrivateKey,
  getPublicAddress,
  removePrivateKey,
  toSeedPhrase,
} from '~/services/wallet';

import { hasItem } from '~/services/storage';

describe('Wallet service', () => {
  let address;
  let privateKey;

  beforeEach(() => {
    privateKey = generatePrivateKey();
  });

  describe('when generating a private key', () => {
    it('should be valid', () => {
      expect(web3.utils.isHexStrict(privateKey)).toBe(true);
    });
  });

  describe('when converting a private key to a seed phrase', () => {
    it('should be able to restore it', () => {
      const address = getPublicAddress(privateKey);
      const seedPhrase = toSeedPhrase(privateKey);
      const restored = fromSeedPhrase(seedPhrase);

      expect(restored).toBe(address);
    });
  });

  describe('when removing a private key', () => {
    it('should not be stored in the LocalStorage anymore', () => {
      removePrivateKey();

      expect(hasItem('privateKey')).toBe(false);
    });
  });
});
