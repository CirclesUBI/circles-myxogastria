import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ClipboardButton from '~/components/ClipboardButton';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';

const SettingsShare = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('SettingsShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View isFooter isHeader>
        <textarea readOnly={true} value={shareText} />
      </View>

      <Footer>
        <ClipboardButton text={shareText}>
          {context.t('SettingsShare.copyToClipboard')}
        </ClipboardButton>
      </Footer>
    </Fragment>
  );
};

SettingsShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsShare;
