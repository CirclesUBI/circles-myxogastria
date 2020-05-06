import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const Pill = (props) => {
  return <PillStyle>{props.children}</PillStyle>;
};

const PillStyle = styled.p`
  padding: 10px;

  border-radius: 1rem;

  color: ${styles.monochrome.white};

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.3) 100%
  );

  font-weight: ${styles.base.typography.weightSemiBold};

  text-align: center;
`;

Pill.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Pill;
