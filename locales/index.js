export const DEFAULT_LOCALE = 'en';
export const LOCALES = ['en', 'id'];

const locales = LOCALES.reduce((acc, locale) => {
  acc[locale] = require(`./${locale}.json`);
  return acc;
}, {});

export default locales;
