import { DateTime } from 'luxon';

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
    const value = getItem(LAST_SEEN_NAME);

    // Legacy (<=1.0.1): Check if value was a UNIX timestamp before
    if (isNaN(value)) {
      return value;
    } else {
      const converted = DateTime.fromMillis(parseInt(value, 10)).toISO();
      setLastSeen(converted);
      return converted;
    }
  }

  return DateTime.fromMillis(0).toISO();
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
