import { createGlobalStyle } from 'styled-components';

import iconsEot from '~/../assets/fonts/circles.eot';
import iconsSvg from '~/../assets/fonts/circles.svg';
import iconsTtf from '~/../assets/fonts/circles.ttf';
import iconsWoff from '~/../assets/fonts/circles.woff';

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

  [class^="icon-"],
  [class*=" icon-"] {
    font-weight: normal;
    font-style: normal;
    font-variant: normal;
    font-family: 'Circles', sans-serif;

    line-height: 1;

    text-transform: none;
  }

  .icon-circles::before {
    content: "\\e900";
  }

  .icon-back::before {
    content: "\\e901";
  }

  .icon-exit::before {
    content: "\\e902";
  }

  .icon-copy::before {
    content: "\\e903";
  }

  .icon-qr::before {
    content: "\\e904";
  }

  .icon-notification::before {
    content: "\\e905";
  }

  .icon-activities::before {
    content: "\\e906";
  }

  .icon-receive::before {
    content: "\\e907";
  }

  .icon-trust::before {
    content: "\\e908";
  }

  .icon-send::before {
    content: "\\e909";
  }
`;
