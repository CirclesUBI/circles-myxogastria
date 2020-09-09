import styled from 'styled-components';

import styles from '~/styles/variables';

const BackgroundBase = styled.div`
  height: 100%;

  background-repeat: no-repeat;
`;

const BackgroundCircleBase = styled(BackgroundBase)`
  position: relative;

  &::after {
    @media ${styles.media.desktop} {
      top: -1rem;
    }

    position: absolute;

    top: 7rem;
    left: 50%;

    display: block;

    width: 62rem;
    height: 62rem;

    border-radius: 50%;

    content: '';

    background-color: ${styles.monochrome.white};

    transform: translate3d(-50%, 0, 0);
  }
`;

// Orange

export const BackgroundWhirlyOrange = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -17.5rem;
  }

  background-size: contain;
`;

export const BackgroundOrangeBottom = styled(BackgroundBase)`
  background-repeat: no-repeat;
  background-size: cover;
`;

export const BackgroundOrangeTop = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -40rem;
    background-size: cover;
  }

  background-position: 50% -30rem;
  background-size: cover;
`;

export const BackgroundOrangeCircle = styled(BackgroundCircleBase)`
  background: linear-gradient(181deg, #d73a53 0%, #fb8609 100%);

  &::after {
    background: linear-gradient(180deg, #13f3b5 29.69%, #5ee6ec 81.77%);
  }
`;

// Green

export const BackgroundWhirlyGreen = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: top center;
  }

  background-position: 0 7rem;
  background-size: cover;
`;

export const BackgroundGreenTop = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -50rem;
  }

  background-position: 50% -30rem;
  background-size: cover;
`;

export const BackgroundGreenCircle = styled(BackgroundCircleBase)`
  background: linear-gradient(180deg, #48b2b7 0%, #06fc9d 100%);
`;

export const BackgroundGreenBottom = styled(BackgroundBase)`
  background-position: 0 10rem;
  background-size: 100% 100%;
`;

// Purple

export const BackgroundPurple = styled(BackgroundBase)`
  background-position: -1rem -1rem;
  background-size: 130%;
`;

export const BackgroundPurpleTop = styled(BackgroundBase)`
  @media ${styles.media.desktop} {
    background-position: 0 -40rem;
    background-size: cover;
  }

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

export const BackgroundPurpleCircle = styled(BackgroundCircleBase)`
  background: linear-gradient(
    180deg,
    ${styles.colors.primaryDark} 0%,
    ${styles.colors.primary} 100%
  );

  &::after {
    background: linear-gradient(180deg, #13f3b5 29.69%, #5ee6ec 81.77%);
  }
`;
