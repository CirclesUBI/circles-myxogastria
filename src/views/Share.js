import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import Button from '~/components/Button';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';

const Share = () => {
  const safe = useSelector((state) => state.safe);

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        <UsernameDisplay address={safe.currentAccount} />
      </Header>
      <View>
        <QRCode data={safe.currentAccount} />
        <p>{translate('Share.showThisQR')}</p>
        <Button to="/receive/share">
          <span>{translate('Share.share')}</span>
        </Button>
      </View>
    </Fragment>
  );
};

export default Share;
