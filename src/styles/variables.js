const layout = {
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

const colors = {
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

const components = {
  footer: {
    height: '5rem',
  },
  header: {
    height: '5rem',
  },
  button: {
    color: monochrome.white,
    colorDisabled: monochrome.gray,
    colorPrimary: colors.purple,
  },
};

const zIndex = {
  view: 100,
  header: 1000,
  footer: 2000,
  actionButtonOverlay: 3000,
  actionButton: 4000,
  notifications: 5000,
};

export default {
  components,
  device: {
    desktop: `(min-width: ${layout.width}) and (min-height: ${layout.height})`,
  },
  layout: {
    height: layout.height,
    width: layout.width,
    spacing: '1rem',
  },
  typography: {
    family: 'Noto Sans',
    lineHeight: 1.5,
    size: '1.6em',
    style: 'normal',
    styleItalic: 'italic',
    weight: 400,
    weightBold: 700,
    weightLight: 300,
    weightSemiBold: 500,
  },
  colors: {
    accent: colors.green,
    accentAlternative: colors.orange,
    accentAlternativeDark: colors.orangeDark,
    background: monochrome.white,
    backgroundAlternative: monochrome.grayLight,
    primary: colors.purple,
    primaryDark: colors.purpleDark,
    secondary: colors.turquoise,
    secondaryDark: colors.turquoiseDark,
  },
  links: {
    color: colors.turquoiseDark,
  },
  border: {
    radius: '1rem',
  },
  shadow: {
    blur: '25px',
    blurSmall: '5px',
    color: monochrome.gray,
  },
  inputs: {
    color: monochrome.black,
    colorBackground: monochrome.grayLightest,
    colorDisabled: monochrome.gray,
  },
  zIndex,
};
