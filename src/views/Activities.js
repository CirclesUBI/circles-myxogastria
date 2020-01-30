import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import BackButton from '~/components/BackButton';
import View from '~/components/View';
import { BackgroundPurple } from '~/styles/Background';
import { updateLastSeen } from '~/store/activity/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Activities = (props, context) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, []);

  return (
    <BackgroundPurple>
      <Header>
        <BackButton to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('Activities.notifications')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <View isHeader>
        <ActivityStream />
      </View>
    </BackgroundPurple>
  );
};

Activities.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Activities;
