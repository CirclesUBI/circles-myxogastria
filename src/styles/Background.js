import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

import green from '%/images/background-green.svg';
import greenBottom from '%/images/background-green-bottom.svg';
import orangeBottom from '%/images/background-orange-bottom.svg';
import orangeTop from '%/images/background-orange-top.svg';
import purple from '%/images/background-purple.svg';
import purpleTop from '%/images/background-purple-top.svg';
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

export const BackgroundGreen = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -50rem;
  }

  background-image: url(${green});
  background-position: 0 -20rem;
  background-size: 100%;
`;

export const BackgroundGreenCircle = styled(BackgroundBase)`
  position: relative;

  background: linear-gradient(180deg, #48b2b7 0%, #06fc9d 100%);

  &::after {
    position: absolute;

    top: ${styles.components.header.height};
    right: -10rem;
    bottom: ${styles.components.footer.height};
    left: -10rem;

    display: block;

    border-radius: 50%;

    content: '';

    background-color: ${styles.monochrome.white};
  }
`;

export const BackgroundGreenBottom = styled(BackgroundBase)`
  background-image: url(${greenBottom});
  background-position: 0 10rem;
  background-size: 100% 100%;
`;

export const BackgroundOrangeBottom = styled(BackgroundBase)`
  background-image: url(${orangeBottom});
  background-repeat: no-repeat;
  background-size: cover;
`;

export const BackgroundOrangeTop = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -40rem;
    background-size: cover;
  }

  background-image: url(${orangeTop});
  background-position: 0 -10rem;
  background-size: contain;
`;

export const BackgroundPurpleTop = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -40rem;
    background-size: cover;
  }

  background-image: url(${purpleTop});
  background-position: 50% -30rem;
  background-size: cover;
`;

export const BackgroundPurplePlain = styled(BackgroundBase)`
  background: linear-gradient(
    180deg,
    ${styles.colors.primaryDark} 0%,
    ${styles.colors.primary} 100%
  );
`;

export const BackgroundPurple = styled(BackgroundBase)`
  background-image: url(${purple});
  background-position: -1rem -1rem;
  background-size: 110%;
`;
