import { createTheme } from '@material-ui/core/styles';

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

const rgba = {
  doveGray: 'rgb(107, 101, 101,0.5)',
  dialogGray: 'rgba(0, 0, 0, 0.25)',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  lightGrey: 'rgba(0, 0, 0, 0.04)',
};

export const colors = {
  ...monochrome,
  ...rgba,
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
  jaggedIce: '#C8E8EA',
  fountainBlue: '#48B2B7',
  fountainBlueLighter: '#6CC1C5',
  springGreen: '#06FC9D',
  pizazz: '#FF8E00',
  ceriseRed: '#D12D5F',
  pink: '#D22E60',
  blueRibbon: '#2B44FF',
  disco: '#99164C',
  violet: '#5A2F56',
  tapestry: '#A75183',
  oldLavender: '#7B5978',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  swansDown: '#DAF0F1',
  blackSqueeze: '#EDF7F8',
  wepeep: '#F5D2E1',
  lola: '#DED5DD',
  cornflowerBlue: '#EFEAEF',
  lily: '#BDACBB',
  cannonPink: '#853F5C',
  cranberry: '#D64B85',
};

const gradients = {
  blueGreen: `linear-gradient(${colors.fountainBlue}, ${colors.springGreen}) padding-box, linear-gradient(to bottom, ${colors.fountainBlue}, ${colors.springGreen}) border-box`,
  gray: `linear-gradient(280deg, ${colors.grayDark} 0%, ${colors.gray} 100%)`,
  grayDark:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(284.04deg, rgba(0, 0, 0, 0.49) 0%, rgba(0, 0, 0, 0.12) 100%);',
  grayAlert: '1px 1px 4px rgba(204, 30, 102, 0.25)',
  purple: `linear-gradient(280deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
  purpleOpposite: `linear-gradient(104.04deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
  purpleHover: `linear-gradient(284.04deg, ${colors.cannonPink} 0%, ${colors.cranberry} 100%)`,
  purpleOppositeHover: `linear-gradient(104.04deg, ${colors.cannonPink} 0%, ${colors.cranberry} 100%)`,
  pinkToPurple: `linear-gradient(284.04deg, ${colors.purpleDark} 0%, ${colors.purple} 100%)`,
  lightPinkToPurple: `linear-gradient(284.04deg, ${colors.cannonPink} 0%, ${colors.cranberry} 100%)`,
  error: `linear-gradient(90deg, ${colors.purpleDark}, ${colors.purple} 100%)`,
  info: `linear-gradient(90deg, ${colors.blue} 0%, ${colors.purpleLight} 100%)`,
  success: `linear-gradient(90deg, ${colors.green} 0%, ${colors.blue} 100%)`,
  warning: `linear-gradient(90deg, ${colors.orangeDark} 0%, ${colors.orange} 100%)`,
  greenBlue: `linear-gradient(180deg, ${colors.fountainBlue} 0%, ${colors.springGreen} 100%)`,
  greenBlueHeader: `linear-gradient(207.4deg, ${colors.fountainBlue} 36.45%, ${colors.springGreen} 155.65%)`,
  pinkShade: `linear-gradient(180deg, rgba(255, 255, 255, 0) 75%, ${colors.pink} 145%)`,
  violetCurved: `linear-gradient(180deg, ${colors.tapestry} 0%, ${colors.violet} 33.2%)`,
  violetHeader: `linear-gradient(207.4deg, ${colors.tapestry} 36.45%, ${colors.violet} 155.65%)`,
  violetTutorial: `linear-gradient(180deg, ${colors.tapestry} 0%, ${colors.violet} 100%)`,
  turquoise: `linear-gradient(0deg, ${colors.green} 0%, ${colors.turquoise} 100%)`,
};

const shadows = {
  gray: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  grayUp: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  navigationFloating: '0px 0px 4px rgba(45, 24, 43, 0.25)',
};

const components = {
  appBarHeight: 64,
  appMaxWidth: 900,
  appMinWidth: 360,
  avatarSize: 50,
  avatarUploader: 85,
  navigationWidth: 300,
};

const fontFamily = `"${fontFamilyNotoSans}", sans-serif`;

export default createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      xlPlus1: 1921,
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
      '&.MuiTypography-gutterBottom': {
        marginBottom: '12px',
      },
    },
  },
  zIndex: {
    qrCodeScannerBackdrop: 10000,
    qrCodeScannerSpinner: 11000,
    qrCodeScannerVideo: 12000,
    spinnerOverlay: 20000,
    layer1: 10,
    layer2: 20,
    backgroundCurvedWrapper: 0,
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
    MuiTypography: {
      root: {
        '&.lightGreyText': {
          color: colors.grayDarker,
        },
      },
    },
    // @NOTE: This is a workaround to fix an issue with Safari 14.1.1
    // displaying the button color wrong after it changed to enabled state.
    //
    // See: https://github.com/mui-org/material-ui/issues/26251
    MuiButton: {
      root: {
        transition: 'color .01s',
        fontSize: 18,
      },
    },
  },
  custom: {
    colors,
    components,
    gradients,
    shadows,
  },
});
