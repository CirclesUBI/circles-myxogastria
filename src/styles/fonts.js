// import notoSansBoldWoff from '%/fonts/notosans-bold-webfont.woff2';
// import notoSansBoldWoff2 from '%/fonts/notosans-bold-webfont.woff2';
// import notoSansItalicWoff from '%/fonts/notosans-italic-webfont.ttf';
// import notoSansItalicWoff2 from '%/fonts/notosans-italic-webfont.woff2';
// import notoSansLightWoff from '%/fonts/notosans-light-webfont.ttf';
// import notoSansLightWoff2 from '%/fonts/notosans-light-webfont.woff2';
// import notoSansLightItalicWoff from '%/fonts/notosans-lightitalic-webfont.ttf';
// import notoSansLightItalicWoff2 from '%/fonts/notosans-lightitalic-webfont.woff2';
// import notoSansWoff from '%/fonts/notosans-regular-webfont.ttf';
// import notoSansWoff2 from '%/fonts/notosans-regular-webfont.woff2';
// import notoSansSemiBoldWoff from '%/fonts/notosans-semibold-webfont.ttf';
// import notoSansSemiBoldWoff2 from '%/fonts/notosans-semibold-webfont.woff2';

import dmSansBoldTtf from '%/fonts/DMSans-Bold.ttf';
import dmSansItalicTtf from '%/fonts/DMSans-Italic.ttf';
import dmSansLightTtf from '%/fonts/DMSans-Light.ttf';
import dmSansLightItalicTtf from '%/fonts/DMSans-LightItalic.ttf';
import dmSansTtf from '%/fonts/DMSans-Regular.ttf';
import dmSansSemiBoldTtf from '%/fonts/DMSans-SemiBold.ttf';

// export const fontFamily = 'Noto Sans';
export const fontFamily = 'DM Sans';

export const fontWeightLight = 300;
export const fontWeightRegular = 400;
export const fontWeightMedium = 500;
export const fontWeightMediumBold = 600;
export const fontWeightBold = 700;

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
    url(${dmSansTtf}) format('ttf');
  `,
};

export const dmSansMedium = {
  ...dmSans,
  fontWeight: fontWeightMedium,
  src: `
    url(${dmSansSemiBoldTtf}) format('ttf');
  `,
};

export const dmSansBold = {
  ...dmSans,
  fontWeight: fontWeightBold,
  src: `
    url(${dmSansBoldTtf}) format('ttf');
  `,
};

export const dmSansItalic = {
  ...dmSans,
  fontStyle: 'italic',
  src: `
    url(${dmSansItalicTtf}) format('ttf');
  `,
};

export const dmSansLight = {
  ...dmSans,
  fontWeight: fontWeightLight,
  src: `
    url(${dmSansLightTtf}) format('ttf');
  `,
};

export const dmSansLightItalic = {
  ...dmSans,
  fontWeight: fontWeightLight,
  fontStyle: 'italic',
  src: `
    url(${dmSansLightItalicTtf}) format('ttf');
  `,
};
