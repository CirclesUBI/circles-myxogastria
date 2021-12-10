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
  whiteAlmost: '#fffcfe',
  white: '#fff',
};

export const colors = {
  ...monochrome,
  red: '#cc0000',
  green: '#45e6af',
  blue: '#3ce6e1',
  orange: '#faad26',
  orangeDark: '#f14d48',
  purpleLight: '#f5dbda',
  purple: '#cc1e66',
  purpleDark: '#660f33',
  turquoise: '#47cccb',
  turquoiseDark: '#369998',
};

const gradients = {
  gray: `linear-gradient(280deg, ${colors.grayDark} 0%, ${colors.gray} 100%)`,
  purple: `linear-gradient(280deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
  turquoise: `linear-gradient(0deg, ${colors.green} 0%, ${colors.turquoise} 100%)`,
  error: `linear-gradient(90deg, ${colors.purpleDark}, ${colors.purple} 100%)`,
  info: `linear-gradient(90deg, ${colors.blue} 0%, ${colors.purpleLight} 100%)`,
  success: `linear-gradient(90deg, ${colors.green} 0%, ${colors.blue} 100%)`,
  warning: `linear-gradient(90deg, ${colors.orangeDark} 0%, ${colors.orange} 100%)`,
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
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  props: {
    MuiDialog: {
      maxWidth: 'lg',
    },
  },
  palette: {
    background: {
      default: colors.whiteAlmost,
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
      main: colors.purple,
      dark: colors.purple,
    },
    warning: {
      main: colors.orange,
      dark: colors.orangeDark,
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
          backgroundColor: colors.white,
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
    MuiDialog: {
      paper: {
        borderRadius: 0,
        borderBottomRightRadius: 48,
      },
    },
    MuiDialogActions: {
      root: {
        justifyContent: 'flex-start',
        padding: 19,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.black,
      },
    },
    MuiListItem: {
      root: {
        font: fontFamily,
        fontWeight: fontWeightLight,
      },
    },
    // @NOTE: This is a workaround to fix an issue with Safari 14.1.1
    // displaying the button color wrong after it changed to enabled state.
    //
    // See: https://github.com/mui-org/material-ui/issues/26251
    MuiButton: {
      root: {
        transition: 'color .01s',
      },
    },

    // box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  },
  custom: {
    colors,
    components,
    gradients,
  },
});
