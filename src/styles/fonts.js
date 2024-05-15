import dmSansBoldTtf from '%/fonts/DMSans-Bold.ttf';
import dmSansItalicTtf from '%/fonts/DMSans-Italic.ttf';
import dmSansLightTtf from '%/fonts/DMSans-Light.ttf';
import dmSansLightItalicTtf from '%/fonts/DMSans-LightItalic.ttf';
import dmSansTtf from '%/fonts/DMSans-Regular.ttf';
import dmSansSemiBoldTtf from '%/fonts/DMSans-SemiBold.ttf';

export const fontFamily = 'DM Sans';
export const fontWeightBold = 700;
export const fontWeightLight = 300;
export const fontWeightMedium = 500;
export const fontWeightMediumBold = 600;
export const fontWeightRegular = 400;

export const fontSizeSmallest = 10;
export const fontSizeSmaller = 12;
export const fontSizeSmall = 14;
export const fontSizeRegular = 16;
export const fontSizeLarge = 18;
export const fontSizeLarger = 20;
export const fontSizeLargest = 24;

export const dmSans = {
  fontWeight: fontWeightRegular,
  fontStyle: 'normal',
  fontFamily,
  src: `
    url(${dmSansTtf}) format('truetype');
  `,
};

export const dmSansMedium = {
  ...dmSans,
  fontWeight: fontWeightMedium,
  src: `
    url(${dmSansSemiBoldTtf}) format('truetype');
  `,
};

export const dmSansBold = {
  ...dmSans,
  fontWeight: fontWeightBold,
  src: `
    url(${dmSansBoldTtf}) format('truetype');
  `,
};

export const dmSansItalic = {
  ...dmSans,
  fontStyle: 'italic',
  src: `
    url(${dmSansItalicTtf}) format('truetype');
  `,
};

export const dmSansLight = {
  ...dmSans,
  fontWeight: fontWeightLight,
  src: `
    url(${dmSansLightTtf}) format('truetype');
  `,
};

export const dmSansLightItalic = {
  ...dmSans,
  fontWeight: fontWeightLight,
  fontStyle: 'italic',
  src: `
    url(${dmSansLightItalicTtf}) format('truetype');
  `,
};
