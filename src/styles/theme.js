import { createTheme } from '@mui/material/styles';

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
  grayLightHover: '#d9d9d9',
  whiteAlmost: '#fffcfe',
  white: '#fff',
};

const rgba = {
  doveGray: 'rgb(107, 101, 101,0.5)',
  dialogGray: 'rgba(0, 0, 0, 0.25)',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  lightGrey: 'rgba(0, 0, 0, 0.04)',
  lightWhite: 'rgba(255, 255, 255, 0.05)',
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
  deepBlush: '#E078A3',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  swansDown: '#DAF0F1',
  blackSqueeze: '#EDF7F8',
  wepeep: '#F5D2E1',
  lola: '#DED5DD',
  cornflowerBlue: '#efeaef',
  lily: '#BDACBB',
  mineShaft: '#212121',
  oldLavender: '#7B5978',
  cannonPink: '#853F5C',
  cranberry: '#D64B85',
  lividBrown: '#482645',
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
  lightGray: '0px 0px 4px rgba(204, 30, 102, 0.1)', //special, warning, error, notifications
  grayBottomRight: ' 1px 1px 4px rgba(204, 30, 102, 0.25)', //success notification
};

const fontFamily = `"${fontFamilyNotoSans}"`;

const components = {
  appBarHeight: 64,
  appMaxWidth: 900,
  appMinWidth: 360,
  avatarSize: 50,
  avatarUploader: 85,
  navigationWidth: 300,
};

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
  palette: {
    icons: {
      dark: colors.violet,
      light: colors.whiteAlmost,
      lightHover: colors.grayLightHover,
    },
    primary: {
      main: colors.purple,
      dark: colors.purpleDark,
      contrastText: colors.whiteAlmost,
    },
    secondary: {
      main: colors.turquoise,
      dark: colors.turquoiseDark,
    },
  },
  typography: {
    fontFamily: [fontFamily, 'sans-serif'].join(','),
    body1: {
      fontSize: '1rem',
      fontWeight: '300',
      lineHeight: '1.5',
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
    poster: {
      fontSize: '4rem',
      color: 'red',
    },
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            poster: 'h1',
          },
        },
      },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightRegular};
          src: ${notoSans.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: italic;
          font-weight: ${fontWeightRegular};
          src: ${notoSansItalic.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightLight};
          src: ${notoSansLight.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: italic;
          font-weight: ${fontWeightLight};
          src: ${notoSansLightItalic.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightMedium};
          src: ${notoSansMedium.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightBold};
          src: ${notoSansBold.src};
        }
      `,
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          '&.lightGreyText': {
            color: colors.grayDarker,
          },
        },
      },
    },
  },
  zIndex: {
    spinnerOverlay: 20000,
    qrCodeScannerVideo: 12000,
    qrCodeScannerSpinner: 11000,
    qrCodeScannerBackdrop: 10000,
    toolbar: 2000,
    floatingMenu: 302,
    floatingMenuIcon: 301,
    floatingMenuButton: 300,
    header: 100,
    scrollShadow: 30,
    layer2: 20,
    layer1: 10,
    backgroundCurvedWrapper: 0,
  },
  custom: {
    colors,
    components,
    gradients,
    shadows,
  },
});
