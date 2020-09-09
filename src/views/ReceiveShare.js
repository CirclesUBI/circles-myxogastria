import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundWhirlyGreen } from '~/styles/Background';

import Header from '~/components/Header';

const ReceiveShare = (props, context) => {
  const safe = useSelector((state) => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.currentAccount}`;
  const shareText = context.t('ReceiveShare.shareText', { shareLink });

  return (
    <BackgroundWhirlyGreen>
      <Header>
        <ButtonBack to="/receive" />
        {context.t('ReceiveShare.receive')}
        <ButtonHome />
      </Header>

      <View>
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
