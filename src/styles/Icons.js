import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

import iconsEot from '%/fonts/circles.eot';
import iconsSvg from '%/fonts/circles.svg';
import iconsTtf from '%/fonts/circles.ttf';
import iconsWoff from '%/fonts/circles.woff';

export default createGlobalStyle`
  @font-face {
    font-weight: normal;
    font-style: normal;
    font-display: block;
    font-family: 'Circles';

    src: url('${iconsEot}?vxg1ru');
    src: url('${iconsEot}?vxg1ru#iefix') format('embedded-opentype'),
      url('${iconsTtf}?vxg1ru') format('truetype'),
      url('${iconsWoff}?vxg1ru') format('woff'),
      url('${iconsSvg}?vxg1ru#circles') format('svg');
  }
`;

export const IconBase = styled.i`
  color: ${props => {
    return props.isDark ? styles.monochrome.black : styles.monochrome.white;
  }};

  font-weight: normal;
  font-style: normal;
  font-variant: normal;
  font-family: 'Circles', sans-serif;

  line-height: 1;

  text-transform: none;
`;

export const IconCircles = styled(IconBase)`
  &::before {
    content: '\\e900';
  }
`;

export const IconBack = styled(IconBase)`
  &::before {
    content: '\\e901';
  }
`;

export const IconExit = styled(IconBase)`
  &::before {
    content: '\\e902';
  }
`;

export const IconShare = styled(IconBase)`
  &::before {
    content: '\\e903';
  }
`;

export const IconQR = styled(IconBase)`
  &::before {
    content: '\\e904';
  }
`;

export const IconNotification = styled(IconBase)`
  &::before {
    content: '\\e905';
  }
`;

export const IconActivities = styled(IconBase)`
  &::before {
    content: '\\e906';
  }
`;

export const IconReceive = styled(IconBase)`
  &::before {
    content: '\\e907';
  }
`;

export const IconTrust = styled(IconBase)`
  &::before {
    content: '\\e908';
  }
`;

export const IconSend = styled(IconBase)`
  &::before {
    content: '\\e909';
  }
`;

export const IconKeys = styled(IconBase)`
  &::before {
    content: '\\e90A';
  }
`;

export const IconSpinner = styled(IconBase)`
  &::before {
    content: '\\e90B';
  }
`;

export const IconScanner = styled(IconBase)`
  &::before {
    content: '\\e90C';
  }
`;
