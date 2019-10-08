import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
import notify from '~/store/notifications/actions';
import { LOCALES } from '~/../locales';
import { selectLocale } from '~/store/locale/actions';

const LocaleSelector = () => {
  return (
    <ul>
      <LocaleSelectorList />
    </ul>
  );
};

const LocaleSelectorList = (props, context) => {
  const { lang } = useSelector(state => state.i18nState);
  const dispatch = useDispatch();

  const onSelect = locale => {
    dispatch(selectLocale(locale));

    dispatch(
      notify({
        text: context.t('LocaleSelector.localeChangedMessage'),
      }),
    );
  };

  return LOCALES.map(locale => {
    const isSelected = lang === locale;

    return (
      <li key={locale}>
        <LocaleSelectorButton
          isSelected={isSelected}
          locale={locale}
          onSelect={onSelect}
        />
      </li>
    );
  });
};

const LocaleSelectorButton = (props, context) => {
  const onSelect = () => {
    props.onSelect(props.locale);
  };

  return (
    <Button disabled={props.isSelected} onClick={onSelect}>
      {context.t(`LocaleSelector.${props.locale}`)}
    </Button>
  );
};

LocaleSelectorList.contextTypes = {
  t: PropTypes.func.isRequired,
};

LocaleSelectorButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

LocaleSelectorButton.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default LocaleSelector;
