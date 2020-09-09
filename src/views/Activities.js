import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import { updateLastSeen } from '~/store/activity/actions';

const Activities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, []);

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        {translate('Activities.notifications')}
      </Header>

      <View>
        <ActivityStream />
      </View>
    </Fragment>
  );
};

export default Activities;
