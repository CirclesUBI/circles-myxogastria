import { setLanguage } from 'redux-i18n';

import { getLocale, setLocale } from '~/services/locale';

export function initializeLocale() {
  const locale = getLocale();

  return setLanguage(locale);
}

export function selectLocale(locale) {
  return (dispatch) => {
    setLocale(locale);

    dispatch(setLanguage(locale));
  };
}
