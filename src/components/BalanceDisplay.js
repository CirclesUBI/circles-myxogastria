import React from 'react';
import { useSelector } from 'react-redux';

const BalanceDisplay = () => {
  const token = useSelector(state => state.token);

  if (token.isLoading && !token.balance) {
    return null;
  }

  return <div>{token.balance} CRC</div>;
};

export default BalanceDisplay;
