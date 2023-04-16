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
  //blue50: '#3A8E92',
  blue100: '#48B2B7',
  blue200: '#6CC1C5',
  //blue300: '#8ED7DA',
  //blue400: '#B6E0E2',
  //blue500: '#DAF0F1',
  blue600: '#EDF7F8',
  //grey50: '#2F2B2E', //black,
  //grey100: '#585558',
  //grey200: '#828082',
  //grey400: '#ACAAAC',
  //grey600: '#D9D9D9',
  //pink50: '#A31852',
  pink100: '#CC1E66', //grad
  pink200: '#D64B85',
  pink300: '#E078A3',
  //pink400: '#EBA5C2',
  pink500: '#F5D2E1',
  //pink600: '#FAE9F0',
  purple50: '#482645',
  purple100: '#5A2F56', // grad
  purple200: '#7B5978',
  //purple300: '#9C8299',
  purple400: '#BDACBB',
  purple500: '#DED5DD',
  //purple600: '#EFEAEF',
  white: '#FFFCFE',
  errorYellow: '#FFC834',
  successGreen: '#05BF93',
  // gradients basis
  pinkDark: '#660F33',
  //pinkLight: pink100,
  //purpleDark: purple100,
  purpleLightGrad: '#A75183',
  //blueDark: blue100,
  greenLight: '#06FC9D', // bluegreen gradient
  pinkHoverLight: '#853F5C', // hover pink grad
  //pinkHoverDark: pink200,
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
  fountainBlue: '#48B2B7', // blue100
  fountainBlueLighter: '#6CC1C5', // blue200
  springGreen: '#06FC9D', // bluegreen gradient - greenLight
  pizazz: '#FF8E00',
  ceriseRed: '#D12D5F',
  pink: '#D22E60',
  blueRibbon: '#2B44FF',
  disco: '#99164C',
  violet: '#5A2F56', // purple100
  tapestry: '#A75183', // purpleLight
  deepBlush: '#E078A3', // pink300
  greyHover: 'rgba(222, 213, 221, 0.8)',
  swansDown: '#DAF0F1',
  blackSqueeze: '#EDF7F8', // blue600
  wepeep: '#F5D2E1', // pink500
  lola: '#DED5DD', // purple500
  cornflowerBlue: '#efeaef',
  lily: '#BDACBB', // purple400
  mineShaft: '#212121',
  oldLavender: '#7B5978', // purple200
  cannonPink: '#853F5C', // pinkHoverLight
  cranberry: '#D64B85', // pink200 + hover pink grad
  lividBrown: '#482645', // purple50
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
    background: {
      default: colors.whiteAlmost,
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
