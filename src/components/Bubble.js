import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

import logo from '%/images/person.svg';

const Bubble = props => {
  return <BubbleStyle>{props.children}</BubbleStyle>;
};

const BubbleStyle = styled.div`
  @media ${styles.media.desktop} {
    width: 30rem;

    border-radius: 10rem;
  }

  position: relative;

  display: flex;

  width: 22rem;
  min-height: 15rem;

  margin: 0 auto;
  padding: 3rem;

  border-radius: 5rem;

  color: ${styles.monochrome.black};

  background-color: ${styles.monochrome.white};

  font-weight: ${styles.base.typography.weight};

  justify-content: center;

  p {
    margin: auto;
  }

  &::before,
  &::after {
    position: absolute;

    display: block;

    content: '';
  }

  &::before {
    right: 0;
    bottom: 0;

    width: 0;
    height: 0;

    border-top: 4rem solid ${styles.monochrome.white};
    border-right: 1.5rem solid transparent;
    border-left: 1.5rem solid transparent;

    transform: rotate(-40deg);
  }

  &::after {
    right: -6rem;
    bottom: -7rem;

    width: 6rem;
    height: 10rem;

    background-image: url(${logo});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

Bubble.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Bubble;
