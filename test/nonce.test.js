import {
  generateRandomNonce,
  getNonce,
  hasNonce,
  removeNonce,
  setNonce,
} from '~/services/safe';

describe('Safe service', () => {
  it('should generate a safe number as a nonce', () => {
    const nonce = generateRandomNonce();
    expect(Number.MAX_SAFE_INTEGER > nonce).toBe(true);
  });

  it('should generate a different nonce every time', () => {
    const firstNonce = generateRandomNonce();
    const secondNonce = generateRandomNonce();
    expect(firstNonce).not.toEqual(secondNonce);
  });

  it('should correctly store it and tell us if it exists', () => {
    expect(hasNonce()).toBe(false);

    const nonce = generateRandomNonce();
    setNonce(nonce);

    expect(parseInt(getNonce(), 10)).toBe(nonce);
    expect(hasNonce()).toBe(true);

    removeNonce();

    expect(hasNonce()).toBe(false);
  });
});
