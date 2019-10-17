import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

import whirlyGreen from '%/images/background-whirly-green.svg';
import whirlyOrange from '%/images/background-whirly-orange.svg';

const { background } = styles.base;

export default createGlobalStyle`
  body {
    background: radial-gradient(circle, ${background.colorGradientPrimary} 0%, ${background.colorGradientSecondary} 100%);
  }
`;

const BackgroundBase = styled.div`
  height: 100%;

  background-repeat: no-repeat;
`;

export const BackgroundWhirlyOrange = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -17.5rem;
  }

  background-image: url(${whirlyOrange});
  background-size: contain;
`;

export const BackgroundWhirlyGreen = styled(BackgroundBase)`
  background-image: url(${whirlyGreen});
  background-position: top center;
  background-size: cover;
`;
