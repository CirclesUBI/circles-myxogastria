import { createMuiTheme } from '@material-ui/core/styles';

import {
  notoSans,
  notoSansBold,
  notoSansItalic,
  notoSansLight,
  notoSansLightItalic,
  notoSansSemiBold,
} from '~/styles/fonts';

export const colors = {
  black: '#000',
  gray: '#ccc',
  grayDark: '#999',
  grayDarker: '#666',
  grayDarkest: '#333',
  grayLight: '#e6e6e6',
  grayLighter: '#f2f2f2',
  grayLightest: '#fafafa',
  white: '#fff',

  green: '#45e6af',
  orange: '#faad26',
  orangeDark: '#ff9933',
  purple: '#cc1e66',
  purpleDark: '#99164c',
  purpleDarker: '#660f33',
  purpleLight: '#e62273',
  turquoise: '#47cccb',
  turquoiseDark: '#369998',
};

const fontFamily = `"Noto Sans", sans-serif`;

export default createMuiTheme({
  palette: {
    background: {
      default: colors.white,
    },
  },

  typography: {
    fontFamily,
  },

  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          notoSans,
          notoSansBold,
          notoSansItalic,
          notoSansLight,
          notoSansLightItalic,
          notoSansSemiBold,
        ],
        fontFamily,
      },
    },
  },

  custom: {
    widthMin: '360px',
    widthMax: '900px',
    navigationWidth: '300px',
  },
});
