import notoSansBoldWoff from '%/fonts/notosans-bold-webfont.woff2';
import notoSansBoldWoff2 from '%/fonts/notosans-bold-webfont.woff2';
import notoSansItalicWoff from '%/fonts/notosans-italic-webfont.woff';
import notoSansItalicWoff2 from '%/fonts/notosans-italic-webfont.woff2';
import notoSansLightItalicWoff from '%/fonts/notosans-lightitalic-webfont.woff';
import notoSansLightItalicWoff2 from '%/fonts/notosans-lightitalic-webfont.woff2';
import notoSansLightWoff from '%/fonts/notosans-light-webfont.woff';
import notoSansLightWoff2 from '%/fonts/notosans-light-webfont.woff2';
import notoSansSemiBoldWoff from '%/fonts/notosans-semibold-webfont.woff';
import notoSansSemiBoldWoff2 from '%/fonts/notosans-semibold-webfont.woff2';
import notoSansWoff from '%/fonts/notosans-regular-webfont.woff';
import notoSansWoff2 from '%/fonts/notosans-regular-webfont.woff2';

export const fontWeightLight = 300;
export const fontWeight = 400;
export const fontWeightSemiBold = 500;
export const fontWeightBold = 700;

export const notoSans = {
  fontWeight,
  fontStyle: 'normal',
  fontFamily: 'Noto Sans',
  src: `
    url(${notoSansWoff2}) format('woff2'),
    url(${notoSansWoff}) format('woff');
  `,
};

export const notoSansSemiBold = {
  ...notoSans,
  fontWeight: fontWeightSemiBold,
  src: `
    url(${notoSansSemiBoldWoff2}) format('woff2'),
    url(${notoSansSemiBoldWoff}) format('woff');
  `,
};

export const notoSansBold = {
  ...notoSans,
  fontWeight: fontWeightBold,
  src: `
    url(${notoSansBoldWoff2}) format('woff2'),
    url(${notoSansBoldWoff}) format('woff');
  `,
};

export const notoSansItalic = {
  ...notoSans,
  fontStyle: 'italic',
  src: `
    url(${notoSansItalicWoff2}) format('woff2'),
    url(${notoSansItalicWoff}) format('woff');
  `,
};

export const notoSansLight = {
  ...notoSans,
  fontWeight: fontWeightLight,
  src: `
    url(${notoSansLightWoff2}) format('woff2'),
    url(${notoSansLightWoff}) format('woff');
  `,
};

export const notoSansLightItalic = {
  ...notoSans,
  fontWeight: fontWeightLight,
  fontStyle: 'italic',
  src: `
    url(${notoSansLightItalicWoff2}) format('woff2'),
    url(${notoSansLightItalicWoff}) format('woff');
  `,
};
