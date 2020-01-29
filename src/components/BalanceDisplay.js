import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import styles from '~/styles/variables';
import web3 from '~/services/web3';
import { IconCircles } from '~/styles/Icons';
import { formatCirclesValue } from '~/utils/format';

const BalanceDisplay = () => {
  const token = useSelector(state => state.token);

  if (token.balance === null) {
    return null;
  }

  const balance = web3.utils.fromWei(token.balance);

  return (
    <BalanceStyle title={balance}>
      <IconCircles />
      <span>{formatCirclesValue(token.balance)}</span>
    </BalanceStyle>
  );
};

const BalanceStyle = styled.div`
  color: ${styles.components.button.color};

  ${IconCircles} {
    margin-right: 1rem;

    &::before {
      @media ${styles.media.desktop} {
        font-size: 3.25rem;
      }

      font-size: 2.5rem;
    }
  }

  span {
    @media ${styles.media.desktop} {
      font-size: 4rem;
    }

    font-weight: ${styles.base.typography.weightLight};
    font-size: 3rem;
  }
`;

export default BalanceDisplay;
