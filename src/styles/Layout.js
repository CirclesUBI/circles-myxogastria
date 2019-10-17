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
  }
`;

export const SpacingStyle = styled.div`
  margin-top: ${styles.base.layout.spacing};
  margin-bottom: ${styles.base.layout.spacing};
`;
