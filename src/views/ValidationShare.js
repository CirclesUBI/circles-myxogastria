import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';

const ValidationShare = (props, context) => {
  const safe = useSelector((state) => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.pendingAddress}`;
  const shareText = context.t('ValidationShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/validation" />
      </Header>

      <View>
        <p>{context.t('ValidationShare.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </Fragment>
  );
};

ValidationShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default ValidationShare;
