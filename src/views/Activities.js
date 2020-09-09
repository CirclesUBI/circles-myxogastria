import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import ButtonBack from '~/components/ButtonBack';
import View from '~/components/View';
import { updateLastSeen } from '~/store/activity/actions';
import Header from '~/components/Header';

const Activities = (props, context) => {
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
        {context.t('Activities.notifications')}
      </Header>

      <View>
        <ActivityStream />
      </View>
    </Fragment>
  );
};

Activities.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Activities;
