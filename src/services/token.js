import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const LAST_PAYOUT = 'lastPayout';

export function getLastPayout() {
  if (isAvailable() && hasLastPayout()) {
    return parseInt(getItem(LAST_PAYOUT), 10);
  }

  return 0;
}

export function hasLastPayout() {
  return hasItem(LAST_PAYOUT);
}

export function setLastPayout(lastPayout) {
  setItem(LAST_PAYOUT, lastPayout);
}

export function removeLastPayout() {
  removeItem(LAST_PAYOUT);
}
