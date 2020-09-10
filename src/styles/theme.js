import { createMuiTheme } from '@material-ui/core/styles';

import {
  fontFamily as fontFamilyNotoSans,
  fontWeightBold,
  fontWeightLight,
  fontWeightMedium,
  fontWeightRegular,
  notoSans,
  notoSansBold,
  notoSansItalic,
  notoSansLight,
  notoSansLightItalic,
  notoSansMedium,
} from '~/styles/fonts';

const monochrome = {
  black: '#000',
  gray: '#ccc',
  grayDark: '#999',
  grayDarker: '#666',
  grayDarkest: '#333',
  grayLight: '#e6e6e6',
  grayLighter: '#f2f2f2',
  grayLightest: '#fafafa',
  white: '#fff',
};

export const colors = {
  ...monochrome,
  green: '#45e6af',
  blue: '#2196f3',
  orange: '#faad26',
  purple: '#cc1e66',
  purpleDark: '#660f33',
  turquoise: '#47cccb',
  turquoiseDark: '#369998',
};

const gradients = {
  purple: `linear-gradient(280deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
};

const components = {
  appBarHeight: 64,
  appMaxWidth: 900,
  appMinWidth: 360,
  navigationWidth: 300,
};

const fontFamily = `"${fontFamilyNotoSans}", sans-serif`;

export default createMuiTheme({
  palette: {
    background: {
      default: colors.white,
      paper: colors.white,
    },
    primary: {
      main: colors.purple,
      dark: colors.purpleDark,
    },
    secondary: {
      main: colors.turquoise,
      dark: colors.turquoiseDark,
    },
    error: {
      main: colors.green,
    },
    warning: {
      main: colors.orange,
    },
    info: {
      main: colors.blue,
    },
    success: {
      main: colors.green,
    },
    action: {
      active: colors.black,
    },
  },
  typography: {
    fontFamily,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          overflowX: 'hidden',
        },
        '@font-face': [
          notoSans,
          notoSansBold,
          notoSansItalic,
          notoSansLight,
          notoSansLightItalic,
          notoSansMedium,
        ],
        fontFamily,
      },
    },
  },
  custom: {
    components,
    gradients,
  },
});
