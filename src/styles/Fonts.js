import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

import notoSansBoldWoff from '~/../assets/fonts/notosans-bold-webfont.woff2';
import notoSansBoldWoff2 from '~/../assets/fonts/notosans-bold-webfont.woff2';
import notoSansItalicWoff from '~/../assets/fonts/notosans-italic-webfont.woff';
import notoSansItalicWoff2 from '~/../assets/fonts/notosans-italic-webfont.woff2';
import notoSansLightItalicWoff from '~/../assets/fonts/notosans-lightitalic-webfont.woff';
import notoSansLightItalicWoff2 from '~/../assets/fonts/notosans-lightitalic-webfont.woff2';
import notoSansLightWoff from '~/../assets/fonts/notosans-light-webfont.woff';
import notoSansLightWoff2 from '~/../assets/fonts/notosans-light-webfont.woff2';
import notoSansSemiBoldWoff from '~/../assets/fonts/notosans-semibold-webfont.woff';
import notoSansSemiBoldWoff2 from '~/../assets/fonts/notosans-semibold-webfont.woff2';
import notoSansWoff from '~/../assets/fonts/notosans-regular-webfont.woff';
import notoSansWoff2 from '~/../assets/fonts/notosans-regular-webfont.woff2';

export default createGlobalStyle`
  @font-face {
    font-weight: ${styles.typography.weightBold};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansBoldWoff2}) format('woff2'),
      url(${notoSansBoldWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.styleItalic};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansItalicWoff2}) format('woff2'),
      url(${notoSansItalicWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weightLight};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansLightWoff2}) format('woff2'),
      url(${notoSansLightWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weightLight};
    font-style: ${styles.typography.styleItalic};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansLightItalicWoff2}) format('woff2'),
      url(${notoSansLightItalicWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weight};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansWoff2}) format('woff2'),
      url(${notoSansWoff}) format('woff');
  }

  @font-face {
    font-weight: ${styles.typography.weightSemiBold};
    font-style: ${styles.typography.style};
    font-family: ${styles.typography.family};

    src:
      url(${notoSansSemiBoldWoff2}) format('woff2'),
      url(${notoSansSemiBoldWoff}) format('woff');
  }
`;
