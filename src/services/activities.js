import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

const LAST_SEEN_NAME = 'lastSeen';

export function getLastSeen() {
  if (isAvailable() && hasLastSeen()) {
    return parseInt(getItem(LAST_SEEN_NAME), 10);
  }

  return 0;
}

export function hasLastSeen() {
  return hasItem(LAST_SEEN_NAME);
}

export function setLastSeen(lastSeen) {
  setItem(LAST_SEEN_NAME, lastSeen);
}

export function removeLastSeen() {
  removeItem(LAST_SEEN_NAME);
}
