import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import ButtonHome from '~/components/ButtonHome';
import View from '~/components/View';

import Header from '~/components/Header';

const NotFound = (props, context) => {
  return (
    <Fragment>
      <Header>
        <ButtonHome />
        {context.t('NotFound.title')}
      </Header>

      <View>
        <p>{context.t('NotFound.description')}</p>
      </View>
    </Fragment>
  );
};

NotFound.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default NotFound;
