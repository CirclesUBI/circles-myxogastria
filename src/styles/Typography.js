import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-size: ${styles.typography.size};
    font-family: ${styles.typography.family}, sans-serif;

    line-height: ${styles.typography.lineHeight};
  }

  p {
    margin: 0;
    padding: 0;

    + p {
      margin-top: 1.5rem;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: ${styles.typography.weightBold};
  }
`;
