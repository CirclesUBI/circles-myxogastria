import { createTheme } from '@mui/material/styles';

import {
  dmSans,
  dmSansBold,
  dmSansItalic,
  dmSansLight,
  dmSansLightItalic,
  dmSansMedium,
  fontFamily as fontFamilyDmSans,
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
} from '~/styles/fonts';

const foundation = {
  //blue50: '#AF4D3E',
  blue100: '#DF6552',
  blue200: '#FF9786',
  //blue300: '#FFBEA6',
  blue400: '#FFDABE',
  blue500: '#F8E6D9',
  blue600: '#F6F1ED', // off-white
  // blue600: '#38318B', // new royal blue
  grey50: '#2F2B2E', // blackish,
  grey100: '#585558',
  //grey200: '#828082',
  grey400: '#ACAAAC',
  grey600: '#D9D9D9',
  pink50: '#26183E',
  pink100: '#38318B', //grad
  pink200: '#4F48A7',
  pink300: '#7B75CD',
  //pink400: '#9893D9',
  pink500: '#C8C6E9',
  pink600: '#E5E4F2',
  purple50: '#26183E',
  purple100: '#38318B', // grad
  purple200: '#4F48A7',
  purple300: '#7B75CD',
  purple400: '#9893D9',
  purple500: '#C8C6E9',
  purple600: '#E5E4F2',
  white: '#F6F1ED',
  errorYellow: '#FFC834',
  successGreen: '#05BF93',
};

const gradientBase = {
  pinkDark: '#38318B',
  pinkHoverLight: '#4F48A7',
  purpleLightGrad: '#A75183',
  springGreen: '#06FC9D',
  green: '#45e6af',
  turquoise: '#DF6552',
};

// should be cleaned up and use the grey palette
const rgba = {
  doveGray: 'rgba(107, 101, 101, 0.5)',
  dialogGray: 'rgba(0, 0, 0, 0.25)',
  greyHover: 'rgba(222, 213, 221, 0.8)',
  lightGrey: 'rgba(0, 0, 0, 0.04)',
  lightWhite: 'rgba(255, 255, 255, 0.05)',
};

export const colors = {
  ...foundation,
  ...gradientBase,
  ...rgba,
};

const gradients = {
  // Grey
  grey: `linear-gradient(280deg, ${colors.grey400} 0%, ${colors.grey400} 100%)`,
  greyAlert: '1px 1px 4px rgba(204, 30, 102, 0.25)',
  // Button gradients
  pinkToPurple: `linear-gradient(284.04deg, ${colors.pinkDark} 0%, ${colors.pinkDark} 100%)`,
  purpleToPink: `linear-gradient(104.04deg, ${colors.pinkDark} 0%, ${colors.pinkDark} 100%)`,
  purpleToLightPink: `linear-gradient(104.04deg, ${colors.pinkHoverLight} 0%, ${colors.pinkHoverLight} 100%)`,
  lightPinkToPurple: `linear-gradient(284.04deg, ${colors.pinkHoverLight} 0%, ${colors.pinkHoverLight} 100%)`,
  // Headers
  greenBlueCurved: `linear-gradient(180deg, ${colors.blue100} 0%, ${colors.blue100} 100%)`,
  greenBlueHeader: `linear-gradient(180deg, ${colors.blue100} 20%, ${colors.blue100} 150%)`,
  violetCurved: `linear-gradient(180deg, ${colors.purple100} 0%, ${colors.purple100} 33.2%)`,
  violetHeader: `linear-gradient(180deg, ${colors.purple100} 20%, ${colors.purple100} 100%)`,
  violetTutorial: `linear-gradient(180deg, ${colors.purpleLightGrad} 20%, ${colors.purple100} 100%)`,
  // Other
  pinkShade: `linear-gradient(180deg, rgba(255, 255, 255, 0) 75%, ${colors.pink100} 145%)`,
  turquoise: `linear-gradient(0deg, ${colors.green} 0%, ${colors.green} 100%)`,
};

const shadows = {
  grey: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  greyUp: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  navigationFloating: '0px 0px 4px rgba(45, 24, 43, 0.25)',
  lightGray: '0px 0px 4px rgba(204, 30, 102, 0.1)', //special, warning, error, notifications
  greyBottomRight: ' 1px 1px 4px rgba(204, 30, 102, 0.25)', //success notification
  greyAround: '0px 0px 4px rgba(45, 24, 43, 0.25)',
};

const fontFamily = `"${fontFamilyDmSans}"`;

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
      lightHover: colors.grey600,
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
        color: colors.grey100,
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
          src: ${dmSans.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: italic;
          font-weight: ${fontWeightRegular};
          src: ${dmSansItalic.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightLight};
          src: ${dmSansLight.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: italic;
          font-weight: ${fontWeightLight};
          src: ${dmSansLightItalic.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightMedium};
          src: ${dmSansMedium.src};
        }
        @font-face {
          font-family: ${fontFamily};
          font-style: normal;
          font-weight: ${fontWeightBold};
          src: ${dmSansBold.src};
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
