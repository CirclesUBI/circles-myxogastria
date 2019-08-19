import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import QRCode from '~/components/QRCode';

const ConnectAccount = () => {
  const { walletAddress } = useSelector(state => state.wallet);

  return (
    <Fragment>
      <BackButton />

      <QRCode data={walletAddress} width={250} />
    </Fragment>
  );
};

export default ConnectAccount;
