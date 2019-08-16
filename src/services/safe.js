import { hasItem, removeItem } from '~/services/storage';

const SAFE_NAME = 'safeAddress';

export function hasSafeAddress() {
  hasItem(SAFE_NAME);
}

export function removeSafeAddress() {
  removeItem(SAFE_NAME);
}
