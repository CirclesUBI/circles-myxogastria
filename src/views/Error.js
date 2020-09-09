import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ButtonPrimary from '~/components/ButtonPrimary';
import View from '~/components/View';
import translate from '~/services/locale';
import { burnApp } from '~/store/app/actions';

const CriticalError = () => {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);

  const onBurnClick = () => {
    if (window.confirm(translate('CriticalError.areYouSure'))) {
      dispatch(burnApp());
    }
  };

  if (app.isErrorCritical) {
    return (
      <Fragment>
        <View>
          <p>{translate('CriticalError.criticalErrorDescription')}</p>

          <ButtonPrimary onClick={onBurnClick}>
            {translate('CriticalError.reset')}
          </ButtonPrimary>
        </View>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <View>
          <p>{translate('CriticalError.criticalErrorReload')}</p>
        </View>
      </Fragment>
    );
  }
};

export default CriticalError;
