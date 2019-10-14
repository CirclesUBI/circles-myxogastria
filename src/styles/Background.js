import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

const { background } = styles.base;

export default createGlobalStyle`
  body {
    background: radial-gradient(circle, ${background.colorGradientPrimary} 0%, ${background.colorGradientSecondary} 100%);
  }
`;
