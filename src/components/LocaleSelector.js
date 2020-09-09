import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import translate, { setLocale, getLocale } from '~/services/locale';
import { ButtonStyle } from '~/components/Button';
import { LOCALES } from 'locales';

const LocaleSelector = () => {
  return (
    <ul>
      <LocaleSelectorList />
    </ul>
  );
};

const LocaleSelectorList = () => {
  const currentLocale = getLocale();

  const onSelect = (locale) => {
    setLocale(locale);
    window.location.reload();
  };

  return LOCALES.map((locale) => {
    const isSelected = currentLocale === locale;

    return (
      <LocaleListItemStyle key={locale}>
        <LocaleSelectorButton
          isSelected={isSelected}
          locale={locale}
          onSelect={onSelect}
        />
      </LocaleListItemStyle>
    );
  });
};

const LocaleSelectorButton = (props) => {
  const onSelect = () => {
    props.onSelect(props.locale);
  };

  return (
    <LocaleButtonStyle disabled={props.isSelected} onClick={onSelect}>
      {translate(`LocaleSelector.${props.locale}`)}
    </LocaleButtonStyle>
  );
};

LocaleSelectorButton.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const LocaleListItemStyle = styled.li`
  display: inline;

  & + & {
    margin-left: 0.5rem;

    &::before {
      display: inline;

      margin-right: 0.5rem;

      content: '/';

      color: ${styles.monochrome.gray};
    }
  }
`;

const LocaleButtonStyle = styled(ButtonStyle)`
  color: ${(props) => {
    return props.disabled ? styles.monochrome.black : styles.monochrome.gray;
  }};

  font-weight: ${styles.base.typography.weightSemiBold};
`;

export default LocaleSelector;
