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
  red: '#cc0000',
  green: '#45e6af',
  blue: '#2196f3',
  orange: '#faad26',
  purple: '#cc1e66',
  purpleDark: '#660f33',
  turquoise: '#47cccb',
  turquoiseDark: '#369998',
};

const gradients = {
  gray: `linear-gradient(280deg, ${colors.grayDark} 0%, ${colors.gray} 100%)`,
  purple: `linear-gradient(280deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
  turquoise: `linear-gradient(0deg, ${colors.green} 0%, ${colors.turquoise} 100%)`,
};

const components = {
  appBarHeight: 64,
  appMaxWidth: 900,
  appMinWidth: 360,
  avatarSize: 50,
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
      main: colors.red,
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
    body1: {
      fontWeight: fontWeightLight,
    },
    h1: {
      fontSize: '32px',
      fontWeight: fontWeightMedium,
      lineHeight: '44px',
    },
    h2: {
      fontSize: '24px',
      fontWeight: fontWeightMedium,
      lineHeight: '33px',
    },
    h6: {
      fontSize: '18px',
      fontWeight: fontWeightMedium,
      lineHeight: '25px',
    },
  },
  zIndex: {
    qrCodeScannerBackdrop: 10000,
    qrCodeScannerSpinner: 11000,
    qrCodeScannerVideo: 12000,
    spinnerOverlay: 20000,
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
    MuiDivider: {
      root: {
        backgroundColor: colors.black,
      },
    },
  },
  custom: {
    components,
    gradients,
  },
});
