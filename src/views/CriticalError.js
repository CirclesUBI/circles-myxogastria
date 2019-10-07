import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';

const CriticalError = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    // @TODO: Use a proper modal here
    if (window.confirm('Are you sure?')) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <View>
        <p>{context.t('views.app.criticalError')}</p>

        <Button onClick={onBurnClick}>
          {context.t('views.app.criticalReset')}
        </Button>
      </View>
    </Fragment>
  );
};

CriticalError.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CriticalError;
