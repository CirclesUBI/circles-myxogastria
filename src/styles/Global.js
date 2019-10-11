import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
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
