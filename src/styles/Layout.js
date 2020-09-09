import styled from 'styled-components';

import styles from '~/styles/variables';

export const SpacingStyle = styled.div`
  margin-top: ${(props) => {
    return props.isLargeTop ? '5rem' : styles.base.layout.spacing;
  }};
  margin-bottom: ${(props) => {
    return props.isLargeBottom ? '5rem' : styles.base.layout.spacing;
  }};
`;
