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
  grayDark: '#999',
  grayDarker: '#666',
  greyLightest: '#fafafa',
  greyLightHover: '#d9d9d9',
};

const rgba = {
  doveGray: 'rgba(107, 101, 101, 0.5)',
  dialogGray: 'rgba(0, 0, 0, 0.25)',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  lightGrey: 'rgba(0, 0, 0, 0.04)',
  lightWhite: 'rgba(255, 255, 255, 0.05)',
};

const foundation = {
  //blue50: '#3A8E92',
  blue100: '#48B2B7',
  blue200: '#6CC1C5',
  //blue300: '#8ED7DA',
  //blue400: '#B6E0E2',
  blue500: '#DAF0F1',
  blue600: '#EDF7F8',
  grey50: '#2F2B2E', // blackish,
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
};

const gradientBase = {
  pinkDark: '#660F33',
  pinkHoverLight: '#853F5C',
  purpleLightGrad: '#A75183',
  springGreen: '#06FC9D',
  green: '#45e6af',
};

export const colors = {
  ...foundation,
  ...gradientBase,
  ...monochrome,
  ...rgba,
  turquoise: '#47cccb', // only in validation status
};

const gradients = {
  // Grey
  grey: `linear-gradient(280deg, ${colors.grayDark} 0%, ${colors.gray} 100%)`,
  greyAlert: '1px 1px 4px rgba(204, 30, 102, 0.25)',
  // Button gradients
  pinkToPurple: `linear-gradient(284.04deg, ${colors.pinkDark} 0%, ${colors.pink100} 100%)`,
  purpleToPink: `linear-gradient(104.04deg, ${colors.pinkDark} 0%, ${colors.pink100} 100%)`,
  purpleToLightPink: `linear-gradient(104.04deg, ${colors.pinkHoverLight} 0%, ${colors.pink200} 100%)`,
  lightPinkToPurple: `linear-gradient(284.04deg, ${colors.pinkHoverLight} 0%, ${colors.pink200} 100%)`,
  // Headers
  greenBlueCurved: `linear-gradient(180deg, ${colors.blue100} 0%, ${colors.springGreen} 50%)`,
  greenBlueHeader: `linear-gradient(180deg, ${colors.blue100} 20%, ${colors.springGreen} 150%)`,
  violetCurved: `linear-gradient(180deg, ${colors.purple100} 0%, ${colors.purpleLightGrad} 33.2%)`,
  violetHeader: `linear-gradient(180deg, ${colors.purple100} 20%, ${colors.purpleLightGrad} 100%)`,
  // Other
  pinkShade: `linear-gradient(180deg, rgba(255, 255, 255, 0) 75%, ${colors.pink100} 145%)`,
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
    color: colors.white,
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
      light: colors.white,
      lightHover: colors.greyLightHover,
    },
    primary: {
      main: colors.pink100,
      dark: colors.pinkDark,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.turquoise,
      // dark: colors.blue50,
    },
    background: {
      default: colors.white,
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
        color: colors.white,
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
        color: colors.white,
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
      color: colors.white,
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
          background: gradients.purpleToLightPink,
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
          background: gradients.purpleToLightPink,
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
        color: colors.white,
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
      background: gradients.violetCurved,
      backgroundClip: 'text',
      textFillColor: colors.purple100,
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
