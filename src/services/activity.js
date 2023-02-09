import { DateTime } from 'luxon';

import core from '~/services/core';
import translate from '~/services/locale';
import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';
import { ZERO_ADDRESS } from '~/utils/constants';
import { formatCirclesValue } from '~/utils/format';

const { ActivityTypes, ActivityFilterTypes } = core.activity;

const LAST_SEEN_NAME = 'lastSeen';
const LAST_RECEIVED_TRANSACTION = 'lastReceivedTransaction';

// Map ActivityTypes to ActivityFilterTypes / categories
const TYPES = {
  [ActivityTypes.ADD_CONNECTION]: ActivityFilterTypes.CONNECTIONS,
  [ActivityTypes.ADD_OWNER]: ActivityFilterTypes.OWNERS,
  [ActivityTypes.HUB_TRANSFER]: ActivityFilterTypes.TRANSFERS,
  [ActivityTypes.REMOVE_CONNECTION]: ActivityFilterTypes.CONNECTIONS,
  [ActivityTypes.REMOVE_OWNER]: ActivityFilterTypes.OWNERS,
  [ActivityTypes.TRANSFER]: ActivityFilterTypes.TRANSFERS,
};

export function typeToCategory(type) {
  if (!(type in TYPES)) {
    throw new Error('Invalid type');
  }

  return TYPES[type];
}

// Handle `lastSeenAt` date in LocalStorage
export function getLastSeen() {
  if (isAvailable() && hasLastSeen()) {
    const value = getItem(LAST_SEEN_NAME);
    return value;
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

export function setLastReceivedTransaction(lastReceived) {
  setItem(LAST_RECEIVED_TRANSACTION, lastReceived);
}

export function getLastReceivedTransaction() {
  if (isAvailable() && hasItem(LAST_RECEIVED_TRANSACTION)) {
    return getItem(LAST_RECEIVED_TRANSACTION);
  }
}

export function initializeLastReceivedTransaction() {
  if (isAvailable() && !hasItem(LAST_RECEIVED_TRANSACTION)) {
    const date = DateTime.now().toISO();
    setLastReceivedTransaction(date);
  }
}

// Format the activity message and extract the most interesting bits from it
export function formatMessage({
  data,
  createdAt,
  type,
  safeAddress,
  walletAddress,
}) {
  let addressActor;
  let addressOrigin;
  let addressTarget;
  let messageId;

  if (type === ActivityTypes.ADD_CONNECTION) {
    if (data.canSendTo === safeAddress) {
      // I've created a trust connection
      messageId = 'MeTrustedSomeone';
      addressActor = data.user;
      addressOrigin = data.canSendTo;
      addressTarget = data.user;
    } else {
      // Someone created a trust connection with you
      messageId = 'TrustedBySomeone';
      addressActor = data.canSendTo;
      addressOrigin = data.user;
      addressTarget = data.canSendTo;
    }
  } else if (type === ActivityTypes.REMOVE_CONNECTION) {
    if (data.canSendTo === safeAddress) {
      // I've removed a trust connection
      messageId = 'MeUntrustedSomeone';
      addressActor = data.user;
      addressOrigin = data.canSendTo;
      addressTarget = data.user;
    } else {
      // Someone removed a trust connection with you
      messageId = 'UntrustedBySomeone';
      addressActor = data.canSendTo;
      addressOrigin = data.user;
      addressTarget = data.canSendTo;
    }
  } else if (type === ActivityTypes.TRANSFER) {
    addressOrigin = data.from;
    addressTarget = data.to;
    if (data.from === ZERO_ADDRESS) {
      // I've received Circles from the Hub (UBI)
      messageId = 'ReceivedUBI';
    } else if (data.to === process.env.SAFE_FUNDER_ADDRESS) {
      // I've paid Gas fees for a transaction
      messageId = 'PaidGasCosts';
    }
  } else if (type === ActivityTypes.HUB_TRANSFER) {
    addressOrigin = data.from;
    addressTarget = data.to;
    if (data.to === safeAddress) {
      // I've received Circles from someone
      messageId = 'ReceivedCircles';
      addressActor = data.from;
    } else {
      // I've sent Circles to someone
      messageId = 'SentCircles';
      addressActor = data.to;
    }
  } else if (type === ActivityTypes.ADD_OWNER) {
    addressOrigin = data.safeAddress;
    addressTarget = data.ownerAddress;
    if (data.ownerAddress === walletAddress) {
      // I've got added to a Safe (usually during Safe creation)
      messageId = 'MyselfAddedToSafe';
    } else {
      // I've added someone to my Safe
      messageId = 'AddedToSafe';
    }
  } else if (type === ActivityTypes.REMOVE_OWNER) {
    // I've removed someone from my Safe
    messageId = 'RemovedFromSafe';
  }

  // Format the given timestamp to a readable string
  const date = DateTime.fromISO(createdAt);
  const formattedDate =
    date > DateTime.local().minus({ days: 7 })
      ? date > DateTime.local().minus({ minutes: 1 })
        ? translate('ActivityStream.bodyDateNow')
        : date.toRelative()
      : date.toFormat('dd/LL/yy HH:mm');

  // Make a copy of the data to not write into the original activity message
  const dataCopy = Object.assign({}, data);

  // Check if find a value in the data (during transfers)
  if ('value' in dataCopy) {
    // Convert the value according to its denominator
    const valueInCircles = formatCirclesValue(dataCopy.value, date, 2, false);
    dataCopy.denominator = 'Circles';
    dataCopy.value = valueInCircles;
  }

  if (!messageId) {
    throw new Error('Unknown activity type');
  }

  return {
    addressActor,
    addressOrigin,
    addressTarget,
    data: dataCopy,
    formattedDate,
    messageId,
  };
}
