import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  html,
  body {
    height: 100%;
  }

  #app {
    @media ${styles.media.desktop} {
      height: auto;
    }

    height: 100%;
  }

  body {
    @media ${styles.media.desktop} {
      display: flex;

      align-items: center;
      justify-content: center;
    }

    position: fixed;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

export const SpacingStyle = styled.div`
  margin-top: ${props => {
    return props.isLargeTop ? '5rem' : styles.base.layout.spacing;
  }};
  margin-bottom: ${props => {
    return props.isLargeBottom ? '5rem' : styles.base.layout.spacing;
  }};
`;
