import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ButtonPrimary, { ButtonPrimaryStyle } from '~/components/ButtonPrimary';
import styles from '~/styles/variables';
import web3 from '~/services/web3';
import { FAQ_URL } from '~/components/ExternalLinkList';
import { IconCircles } from '~/styles/Icons';
import { formatCirclesValue } from '~/utils/format';

import person from '%/images/person.svg';

const ISSUANCE_RATE_MONTH = process.env.ISSUANCE_RATE_MONTH || 50;

const BalanceDisplay = (props, context) => {
  const token = useSelector(state => state.token);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  if (token.balance === null) {
    return null;
  }

  const balance = web3.utils.fromWei(token.balance);

  const onClick = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  const onCloseClick = () => {
    setIsTooltipVisible(false);
  };

  return (
    <BalanceStyle title={balance} onClick={onClick}>
      <IconCircles />
      <span>{formatCirclesValue(token.balance)}</span>

      <BalanceTooltipStyle isVisible={isTooltipVisible}>
        <BalancePersonStyle />

        <h3>{context.t('BalanceDisplay.thisIsYourUBI')}</h3>
        <p>
          {context.t('BalanceDisplay.issuanceRate', {
            rate: ISSUANCE_RATE_MONTH,
          })}
        </p>

        <ButtonPrimary onClick={onCloseClick}>
          {context.t('BalanceDisplay.gotIt')}
        </ButtonPrimary>

        <a href={FAQ_URL} rel="noopener noreferrer" target="_blank">
          <ButtonPrimaryStyle isOutline>
            {context.t('BalanceDisplay.learnMore')}
          </ButtonPrimaryStyle>
        </a>
      </BalanceTooltipStyle>
    </BalanceStyle>
  );
};

const BalanceStyle = styled.div`
  color: ${styles.components.button.color};

  cursor: pointer;

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

const BalanceTooltipStyle = styled.div`
  @media ${styles.media.desktop} {
    right: 20%;
    left: 20%;
  }

  position: absolute;

  top: ${styles.components.header.height};
  right: 0;
  left: 0;

  display: ${props => {
    return props.isVisible ? 'block' : 'none';
  }};

  padding: 2rem;

  border-radius: 1.6rem;

  color: ${styles.monochrome.black};

  background-color: ${styles.monochrome.white};

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  h3 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;

    font-weight: ${styles.base.typography.weight};
    font-size: 1.6em;
  }

  &::before {
    position: absolute;

    top: -2rem;
    left: 48%;

    display: block;

    width: 0;
    height: 0;

    border-right: 1.5rem solid transparent;
    border-bottom: 2rem solid ${styles.monochrome.white};
    border-left: 1.5rem solid transparent;

    content: '';
  }
`;

const BalancePersonStyle = styled.div`
  float: left;

  width: 6rem;
  height: 10rem;

  margin-right: 1.5rem;

  background-image: url(${person});
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;

  transform: scaleX(-1);
`;

BalanceDisplay.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default BalanceDisplay;
