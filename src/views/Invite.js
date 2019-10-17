import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundWhirlyGreen } from '~/styles/Background';

const Invite = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('Invite.inviteText', { shareLink });

  return (
    <BackgroundWhirlyGreen>
      <Header>
        <BackButton isDark to="/" />
      </Header>

      <View isHeader>
        <p>{context.t('Invite.description')}</p>
        <ShareTextBox text={shareText} />
      </View>
    </BackgroundWhirlyGreen>
  );
};

Invite.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Invite;
