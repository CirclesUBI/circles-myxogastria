import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import ButtonHome from '~/components/ButtonHome';
import View from '~/components/View';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const NotFound = (props, context) => {
  return (
    <Fragment>
      <Header>
        <ButtonHome isDark />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>{context.t('NotFound.title')}</HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <View isHeader>
        <p>{context.t('NotFound.description')}</p>
      </View>
    </Fragment>
  );
};

NotFound.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default NotFound;
