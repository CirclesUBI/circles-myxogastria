export const LOCALES = ['de', 'en'];

const locales = LOCALES.reduce((acc, locale) => {
  acc[locale] = require(`./${locale}.json`);
  return acc;
}, {});

export default locales;
