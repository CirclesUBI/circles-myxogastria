import {
  getItem,
  hasItem,
  isAvailable,
  removeItem,
  setItem,
} from '~/services/storage';

import { DEFAULT_LOCALE, LOCALES } from '../../locales';

const LOCALE_NAME = 'locale';

export function getLocale() {
  if (!isAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  if (hasLocale()) {
    return getItem(LOCALE_NAME);
  }

  return DEFAULT_LOCALE;
}

export function hasLocale() {
  return hasItem(LOCALE_NAME);
}

export function setLocale(locale) {
  if (!LOCALES.includes(locale)) {
    throw new Error(`Can't set unknown locale ${locale}`);
  }

  setItem(LOCALE_NAME, locale);
}

export function removeLocale() {
  removeItem(LOCALE_NAME);
}
