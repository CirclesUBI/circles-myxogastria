import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
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

          <Button onClick={onBurnClick}>
            {translate('CriticalError.reset')}
          </Button>
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
