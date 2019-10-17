import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import notify from '~/store/notifications/actions';
import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { selectLocale } from '~/store/locale/actions';

import { LOCALES } from 'locales';

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

const LocaleSelectorButton = (props, context) => {
  const onSelect = () => {
    props.onSelect(props.locale);
  };

  return (
    <LocaleButtonStyle disabled={props.isSelected} onClick={onSelect}>
      {context.t(`LocaleSelector.${props.locale}`)}
    </LocaleButtonStyle>
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
  color: ${props => {
    return props.disabled ? styles.monochrome.black : styles.monochrome.gray;
  }};

  font-weight: ${styles.base.typography.weightSemiBold};
`;

export default LocaleSelector;
