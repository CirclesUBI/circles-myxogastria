import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  html,
  body {
    height: 100%;
  }

  #app {
    @media ${styles.device.desktop} {
      height: auto;
    }

    height: 100%;
  }

  body {
    @media ${styles.device.desktop} {
      display: flex;

      align-items: center;
      justify-content: center;
    }
  }
`;
