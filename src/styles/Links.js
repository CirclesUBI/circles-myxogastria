import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  a {
    color: ${styles.links.color};

    text-decoration: none;
  }
`;
