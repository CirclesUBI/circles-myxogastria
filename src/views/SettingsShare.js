import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';

const SettingsShare = (props, context) => {
  const safe = useSelector((state) => state.safe);
  const shareLink = `${process.env.BASE_PATH}/profile/${safe.currentAccount}`;
  const shareText = context.t('SettingsShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <UsernameDisplay address={safe.currentAccount} />
        <ButtonHome />
      </Header>

      <View>
        <p>{context.t('SettingsShare.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </Fragment>
  );
};

SettingsShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsShare;
