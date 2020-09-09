import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import translate from '~/services/locale';

const ReceiveShare = () => {
  const safe = useSelector((state) => state.safe);
  const shareLink = `${process.env.BASE_PATH}/profile/${safe.currentAccount}`;
  const shareText = translate('ReceiveShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/receive" />
        {translate('ReceiveShare.receive')}
        <ButtonHome />
      </Header>

      <View>
        <p>{translate('ReceiveShare.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </Fragment>
  );
};

export default ReceiveShare;
