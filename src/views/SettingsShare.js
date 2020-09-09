import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';

const SettingsShare = () => {
  const safe = useSelector((state) => state.safe);
  const shareLink = `${process.env.BASE_PATH}/profile/${safe.currentAccount}`;
  const shareText = translate('SettingsShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <UsernameDisplay address={safe.currentAccount} />
        <ButtonHome />
      </Header>

      <View>
        <p>{translate('SettingsShare.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </Fragment>
  );
};

export default SettingsShare;
