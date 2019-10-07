import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import View from '~/components/View';
import { burnApp } from '~/store/app/actions';

const CriticalError = (props, context) => {
  const dispatch = useDispatch();

  const onBurnClick = () => {
    if (window.confirm(context.t('CriticalError.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  return (
    <Fragment>
      <View>
        <p>{context.t('CriticalError.criticalErrorDesription')}</p>

        <Button onClick={onBurnClick}>
          {context.t('CriticalError.reset')}
        </Button>
      </View>
    </Fragment>
  );
};

CriticalError.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CriticalError;
