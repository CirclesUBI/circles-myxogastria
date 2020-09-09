import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import translate from '~/services/locale';

const Invite = () => {
  const safe = useSelector((state) => state.safe);
  const shareLink = `${process.env.BASE_PATH}/profile/${safe.currentAccount}`;
  const shareText = translate('Invite.inviteText', { shareLink });

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
      </Header>

      <View>
        <p>{translate('Invite.description')}</p>
        <ShareTextBox text={shareText} url={shareLink} />
      </View>
    </Fragment>
  );
};

export default Invite;
