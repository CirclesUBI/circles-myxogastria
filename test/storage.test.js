import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const TEST_KEY = 'test';
const TEST_VALUE = '1337';

describe('Storage service', () => {
  it('should store a value and return it', () => {
    setItem(TEST_KEY, TEST_VALUE);
    expect(getItem(TEST_KEY)).toBe(TEST_VALUE);
  });

  it('should check if a value exists', () => {
    setItem(TEST_KEY, TEST_VALUE);
    expect(hasItem(TEST_KEY)).toBe(true);

    removeItem(TEST_KEY);
    expect(hasItem(TEST_KEY)).toBe(false);
  });

  it('should check if LocalStorage is accessible', () => {
    expect(isAvailable()).toBe(true);

    Object.defineProperty(window, 'localStorage', { value: null });
    expect(isAvailable()).toBe(false);
  });
});
