import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ClipboardButton from '~/components/ClipboardButton';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';

const ReceiveShare = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('ReceiveShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <BackButton to="/receive" />
      </Header>

      <View isFooter isHeader>
        <textarea readOnly={true} value={shareText} />
      </View>

      <Footer>
        <ClipboardButton text={shareText}>
          {context.t('ReceiveShare.copyToClipboard')}
        </ClipboardButton>
      </Footer>
    </Fragment>
  );
};

ReceiveShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default ReceiveShare;
