import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
import notify from '~/store/notifications/actions';
import { selectLocale } from '~/store/locale/actions';

const LocaleSelector = (props, context) => {
  const dispatch = useDispatch();
  const { lang } = useSelector(state => state.i18nState);

  const showNotification = () => {
    dispatch(
      notify({
        text: 'Locale changed!', // @TODO
      }),
    );
  };

  const onEnglishSelect = () => {
    dispatch(selectLocale('en'));
    showNotification();
  };

  const onGermanSelect = () => {
    dispatch(selectLocale('de'));
    showNotification();
  };

  return (
    <Fragment>
      <Button disabled={lang === 'en'} onClick={onEnglishSelect}>
        {context.t('views.settings.locale.en')}
      </Button>

      <Button disabled={lang === 'de'} onClick={onGermanSelect}>
        {context.t('views.settings.locale.de')}
      </Button>
    </Fragment>
  );
};

LocaleSelector.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default LocaleSelector;
