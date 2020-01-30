import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import HomeButton from '~/components/HomeButton';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundWhirlyGreen } from '~/styles/Background';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const ReceiveShare = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('ReceiveShare.shareText', { shareLink });

  return (
    <BackgroundWhirlyGreen>
      <Header>
        <BackButton isDark to="/receive" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('ReceiveShare.receive')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton isDark />
      </Header>

      <View isHeader>
        <p>{context.t('ReceiveShare.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </BackgroundWhirlyGreen>
  );
};

ReceiveShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default ReceiveShare;
