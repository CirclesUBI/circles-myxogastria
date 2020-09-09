import React, { Fragment } from 'react';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';

const NotFound = () => {
  return (
    <Fragment>
      <Header>
        <ButtonHome />
        {translate('NotFound.title')}
      </Header>

      <View>
        <p>{translate('NotFound.description')}</p>
      </View>
    </Fragment>
  );
};

export default NotFound;
