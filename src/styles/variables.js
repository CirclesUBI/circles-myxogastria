// Definitions

const dimensions = {
  height: '500px',
  width: '700px',
};

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

const color = {
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

// Typography

const typography = {
  family: 'Noto Sans',
  lineHeight: 1.5,
  size: '1.6em',
  style: 'normal',
  styleItalic: 'italic',
  weight: 400,
  weightBold: 700,
  weightLight: 300,
  weightSemiBold: 500,
};

// Colors

const colors = {
  accent: color.green,
  accentAlternative: color.orange,
  accentAlternativeDark: color.orangeDark,
  primary: color.purple,
  primaryDark: color.purpleDark,
  primaryDarker: color.purpleDarker,
  secondary: color.turquoise,
  secondaryDark: color.turquoiseDark,
};

// Base

const background = {
  color: monochrome.white,
  colorGradientPrimary: monochrome.white,
  colorGradientSecondary: monochrome.grayLight,
};

const inputs = {
  color: monochrome.black,
  colorBackground: monochrome.grayLightest,
  colorDisabled: monochrome.gray,
  fontFamily: typography.family,
  fontWeight: typography.weight,
};

const layout = {
  borderRadius: '1rem',
  spacing: '2rem',
  width: dimensions.width,
  height: dimensions.height,
};

const links = {
  color: color.turquoiseDark,
};

const base = {
  background,
  inputs,
  layout,
  links,
  typography,
};

// Components

const components = {
  footer: {
    height: '7rem',
  },
  header: {
    height: '8rem',
  },
  button: {
    color: monochrome.white,
    colorDisabled: monochrome.gray,
    colorPrimary: color.purple,
  },
};

// Media-query

const media = {
  desktop: `(min-width: ${dimensions.width}) and (min-height: ${dimensions.height})`,
};

// Z-index

const zIndex = {
  view: 100,
  header: 1000,
  footer: 2000,
  actionButtonOverlay: 3000,
  actionButton: 4000,
  notifications: 5000,
};

// Variables

export default {
  base,
  colors,
  components,
  media,
  monochrome,
  zIndex,
};
