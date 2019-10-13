import React from 'react';
import { useSelector } from 'react-redux';

import web3 from '~/services/web3';

const BalanceDisplay = () => {
  const token = useSelector(state => state.token);

  if (token.isLoading && !token.balance) {
    return null;
  }

  if (!token.balance) {
    return null;
  }

  const balance = web3.utils.fromWei(token.balance);
  return <div>{balance} CRC</div>;
};

export default BalanceDisplay;
