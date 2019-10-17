import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundWhirlyGreen } from '~/styles/Background';

const SettingsShare = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('SettingsShare.shareText', { shareLink });

  return (
    <BackgroundWhirlyGreen>
      <Header>
        <BackButton isDark to="/settings" />
      </Header>

      <View isHeader>
        <p>{context.t('SettingsShare.description')}</p>
        <ShareTextBox text={shareText} />
      </View>
    </BackgroundWhirlyGreen>
  );
};

SettingsShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsShare;
