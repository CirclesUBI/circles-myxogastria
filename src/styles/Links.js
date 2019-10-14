import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

const { links } = styles.base;

export default createGlobalStyle`
  a {
    color: ${links.color};

    text-decoration: none;
  }
`;
