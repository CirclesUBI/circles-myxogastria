import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  body {
    background: radial-gradient(circle, ${styles.colors.backgroundAlternative} 0%, ${styles.colors.background} 100%);
  }
`;
