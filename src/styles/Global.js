import normalize from 'styled-normalize';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  ${normalize}

  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

    &,
    &::before,
    &::after {
      box-sizing: border-box;

      text-rendering: optimizeLegibility;
    }
  }
`;
