import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Address = styled.p`
  font-weight: bold;

  text-align: center;
`;

const AccountAddress = () => {
  const { address, isReady } = useSelector(state => state.wallet);

  if (!isReady) {
    return;
  }

  return <Address>Wallet: {address.substring(2, 16)}</Address>;
};

export default AccountAddress;
