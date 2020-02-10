export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['de', 'en', 'es'];

const locales = LOCALES.reduce((acc, locale) => {
  acc[locale] = require(`./${locale}.json`);
  return acc;
}, {});

export default locales;
