import { createTheme } from '@mui/material/styles';

import {
  fontFamily as fontFamilyNotoSans,
  fontSizeLarge,
  fontSizeLarger,
  fontSizeLargest,
  fontSizeRegular,
  fontSizeSmall,
  fontSizeSmaller,
  fontSizeSmallest,
  fontWeightBold,
  fontWeightLight,
  fontWeightMedium,
  fontWeightMediumBold,
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
  blue500: '#DAF0F1',
  blue600: '#EDF7F8',
  grey50: '#2F2B2E', //black,
  //grey100: '#585558',
  //grey200: '#828082',
  //grey400: '#ACAAAC',
  //grey600: '#D9D9D9',
  pink50: '#A31852',
  pink100: '#CC1E66', //grad
  pink200: '#D64B85',
  pink300: '#E078A3',
  //pink400: '#EBA5C2',
  pink500: '#F5D2E1',
  pink600: '#FAE9F0',
  purple50: '#482645',
  purple100: '#5A2F56', // grad
  purple200: '#7B5978',
  purple300: '#9C8299',
  purple400: '#BDACBB',
  purple500: '#DED5DD',
  purple600: '#EFEAEF',
  white: '#FFFCFE',
  errorYellow: '#FFC834',
  successGreen: '#05BF93',
  // gradients basis
  pinkDark: '#660F33',
  //pinkLight: pink100,
  //purpleDark: purple100,
  purpleLightGrad: '#A75183',
  //blueDark: blue100,
  springGreen: '#06FC9D', // bluegreen gree gradient
  pinkHoverLight: '#853F5C', // hover pink grad
  //pinkHoverDark: pink200,
  // ------------------------------------
  ...monochrome,
  ...rgba,
  green: '#45e6af', // only in gradient - will be replaced by spring green later
  purpleLight: '#f5dbda', // only in gradients - similar pink600
  // replace identical purple: '#cc1e66', // pink100
  purpleDark: '#660f33',
  turquoise: '#47cccb',
  turquoiseDark: '#369998',
  jaggedIce: '#C8E8EA',
  //disco: '#A31852', // pink50 replaced //disco: '#99164C' old,
  // replaced identical fountainBlue: '#48B2B7', // blue100 x
  // replaced identical fountainBlueLighter: '#6CC1C5', // blue200 x
  // moved springGreen: '#06FC9D', // bluegreen gradient - greenLight x
  // unused pizazz: '#FF8E00',
  // unused ceriseRed: '#D12D5F',
  // replaced similar pink: '#D22E60', // similar to pink100
  blueRibbon: '#2B44FF', // very blue - used for hyper links - QA hyperlinks in banners and onboarding checkboxes
  // replaced identical violet: '#5A2F56', // purple100 x
  // replaced identical tapestry: '#A75183', // purpleLight x
  // replaced identical deepBlush: '#E078A3', // pink300 x
  greyHover: 'rgba(222, 213, 221, 0.8)',
  // replaced identical swansDown: '#DAF0F1', // blue500
  // replaced identical blackSqueeze: '#EDF7F8', // blue600 x
  // NEW wepeep: '#FAE9F0',
  // replaced identical wepeep: '#F5D2E1', // pink500 and pink600
  // replaced identical lola: '#DED5DD', // purple500
  // replaced identical cornflowerBlue: '#efeaef' and '#efeaef80', // #EFEAEF purple600
  // replaced identical lily: '#BDACBB', // purple400
  // replaced mountbattenPink: '#9C8299', // purple300
  // replaced similar mineShaft: '#212121', // similar to grey50
  // replaced identical oldLavender: '#7B5978', // purple200
  cannonPink: '#853F5C', // pinkHoverLight - used for buttons too
  // replaced identical cranberry: '#D64B85', // pink200 + hover pink grad
  // replaced identical lividBrown: '#482645', // purple50
};

const gradients = {
  blueGreen: `linear-gradient(${colors.blue100}, ${colors.springGreen}) padding-box, linear-gradient(to bottom, ${colors.blue100}, ${colors.springGreen}) border-box`,
  gray: `linear-gradient(280deg, ${colors.grayDark} 0%, ${colors.gray} 100%)`,
  grayDark:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(284.04deg, rgba(0, 0, 0, 0.49) 0%, rgba(0, 0, 0, 0.12) 100%);',
  grayAlert: '1px 1px 4px rgba(204, 30, 102, 0.25)',
  purple: `linear-gradient(280deg, ${colors.purpleDark} 0%, ${colors.pink100} 100%)`,
  purpleOpposite: `linear-gradient(104.04deg, ${colors.purpleDark} 0%, ${colors.pink100} 100%)`,
  purpleHover: `linear-gradient(284.04deg, ${colors.cannonPink} 0%, ${colors.pink200} 100%)`,
  purpleOppositeHover: `linear-gradient(104.04deg, ${colors.cannonPink} 0%, ${colors.pink200} 100%)`,
  pinkToPurple: `linear-gradient(284.04deg, ${colors.purpleDark} 0%, ${colors.pink100} 100%)`,
  lightPinkToPurple: `linear-gradient(284.04deg, ${colors.cannonPink} 0%, ${colors.pink200} 100%)`,
  greenBlue: `linear-gradient(180deg, ${colors.blue100} 0%, ${colors.springGreen} 100%)`,
  greenBlueHeader: `linear-gradient(207.4deg, ${colors.blue100} 36.45%, ${colors.springGreen} 155.65%)`,
  pinkShade: `linear-gradient(180deg, rgba(255, 255, 255, 0) 75%, ${colors.pink100} 145%)`,
  violetCurved: `linear-gradient(180deg, ${colors.purpleLight} 0%, ${colors.purple100} 33.2%)`,
  violetHeader: `linear-gradient(207.4deg, ${colors.purpleLight} 36.45%, ${colors.purple100} 155.65%)`,
  violetTutorial: `linear-gradient(180deg, ${colors.purpleLight} 0%, ${colors.purple100} 100%)`,
  turquoise: `linear-gradient(0deg, ${colors.green} 0%, ${colors.turquoise} 100%)`,
};

const shadows = {
  gray: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  grayUp: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  navigationFloating: '0px 0px 4px rgba(45, 24, 43, 0.25)',
  lightGray: '0px 0px 4px rgba(204, 30, 102, 0.1)', //special, warning, error, notifications
  grayBottomRight: ' 1px 1px 4px rgba(204, 30, 102, 0.25)', //success notification
  grayAround: '0px 0px 4px rgba(45, 24, 43, 0.25)',
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

const body4Styles = {
  fontWeight: fontWeightRegular,
  fontSize: fontSizeSmall,
  lineHeight: '19px',
  color: colors.purple100,
  '&.body4_white': {
    color: colors.whiteAlmost,
  },
  '&.body4_gradient_purple': {
    background: gradients.lightPinkToPurple,
    backgroundClip: 'text',
    textFillColor: 'transparent',
  },
};

const body5Styles = {
  fontWeight: fontWeightMediumBold,
  fontSize: fontSizeSmall,
  lineHeight: '19px',
  color: colors.purple100,
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
      dark: colors.purple100,
      light: colors.whiteAlmost,
      lightHover: colors.grayLightHover,
    },
    primary: {
      main: colors.pink100,
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
    h1: {
      fontWeight: fontWeightMedium,
      lineHeight: '25px',
      fontSize: fontSizeLargest,
      '&.h1_blue': {
        color: colors.blue200,
        fontWeight: fontWeightRegular,
      },
      '&.h1_violet': {
        color: colors.purple100,
        fontWeight: fontWeightRegular,
      },
      '&.MuiTypography-gutterBottom': {
        marginBottom: fontSizeSmaller,
      },
    },
    h2: {
      fontWeight: fontWeightMedium,
      fontSize: fontSizeLarger,
      lineHeight: '160%',
      color: colors.purple100,
    },
    h3: {
      fontWeight: fontWeightRegular,
      fontSize: fontSizeLarger,
      lineHeight: '140%',
      color: colors.purple100,
    },
    h4: {
      fontWeight: fontWeightMedium,
      fontSize: fontSizeLarge,
      lineHeight: '22px',
      color: colors.purple100,
      '&.h4_link_white': {
        lineHeight: '25px',
        color: colors.whiteAlmost,
      },
    },
    h5: {
      fontWeight: fontWeightMedium,
      fontSize: fontSizeRegular,
      lineHeight: '22px',
      color: colors.purple100,
    },
    body1: {
      fontSize: fontSizeRegular,
      fontWeight: fontWeightRegular,
      lineHeight: '140%',
      color: colors.purple100,
      '&.body1_white': {
        color: colors.whiteAlmost,
        fontWeight: fontWeightMedium,
      },
    },
    body2: {
      fontWeight: fontWeightBold,
      fontSize: fontSizeRegular,
      lineHeight: '120%',
      color: colors.purple100,
    },
    body3: {
      fontWeight: fontWeightMediumBold,
      fontSize: fontSizeRegular,
      lineHeight: '22px',
      color: colors.whiteAlmost,
      '&.body3_link': {
        textDecorationLine: 'underline',
        '&:hover': {
          color: colors.purple300,
        },
      },
      '&.body3_link_violet': {
        color: colors.purple100,
      },
      '&.body3_link_gradient': {
        lineHeight: '120%',
        background: gradients.pinkToPurple,
        backgroundClip: 'text',
        textFillColor: 'transparent',
        textDecorationLine: 'none',
        '&:hover': {
          background: gradients.purpleOppositeHover,
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
    },
    body4: {
      ...body4Styles,
    },
    body5: {
      ...body5Styles,
      '&.body5_link': {
        background: gradients.pinkToPurple,
        backgroundClip: 'text',
        textFillColor: 'transparent',
        '&:hover': {
          background: gradients.purpleOppositeHover,
          backgroundClip: 'text',
          textFillColor: 'transparent',
        },
      },
    },
    body6: {
      fontWeight: fontWeightRegular,
      fontSize: fontSizeSmaller,
      lineHeight: '16px',
      color: colors.purple100,
      '&.body6_monochrome': {
        color: colors.purple100,
        opacity: 0.6,
      },
      '&.body6_pink': {
        color: colors.pink50,
      },
      '&.body6_white': {
        color: colors.whiteAlmost,
        fontWeight: fontWeightMedium,
      },
      '&.body6_grey': {
        color: colors.grayDarker,
      },
    },
    body7: {
      fontWeight: fontWeightRegular,
      fontSize: fontSizeSmaller,
      lineHeight: '140%',
      color: colors.purple100,
    },
    body8: {
      fontWeight: fontWeightRegular,
      fontSize: fontSizeSmallest,
      lineHeight: '14px',
      color: colors.purple200,
    },
    balance1: {
      fontWeight: fontWeightRegular,
      fontSize: '48px',
      lineHeight: '65px',
      background: gradients.purple100Curved,
      backgroundClip: 'text',
      textFillColor: 'transparent',
      '& svg': {
        fill: colors.purple100,
      },
      '& a': {
        textDecoration: 'none',
      },
    },
    poster: {
      fontSize: '4rem',
      color: 'red',
    },
    wysiwyg: {
      '& p': {
        ...body4Styles,
      },
      '& a': {
        ...body5Styles,
        textDecoration: 'none',
        color: colors.pink100,
      },
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
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '32px',
          paddingRight: '32px',
        },
      },
    },
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
