import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import View from '~/components/View';
import LocaleSelector from '~/components/LocaleSelector';

const SettingsLocale = () => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View isHeader>
        <LocaleSelector />
      </View>
    </Fragment>
  );
};

SettingsLocale.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsLocale;
