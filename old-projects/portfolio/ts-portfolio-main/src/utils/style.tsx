/**
 * Media query breakpoints
 */
interface Breakpoints {
  [key: string]: number;
}
export const media: Breakpoints = {
  desktop: 2080,
  laptop: 1680,
  tablet: 1040,
  mobile: 696,
  mobileS: 400,
};

/**
 * Convert a px string to a number
 */
interface pxToNumber {
  (px: string): number;
}
export const pxToNum: pxToNumber = px => Number(px.replace('px', ''));

/**
 * Convert a number to a px string
 */
interface numberToPx {
  (num: number): string;
}
export const numToPx: numberToPx = num => `${num}px`;

/**
 * Convert pixel values to rem for a11y
 */
interface pxToRem {
  (px: number): string;
}
export const pxToRem: pxToRem = px => `${px / 16}rem`;

/**
 * Convert ms token values to a raw numbers for ReactTransitionGroup
 * Transition delay props
 */
interface msToNumber {
  (ms: string): number;
}
export const msToNum: msToNumber = msString => Number(msString.replace('ms', ''));

/**
 * Convert a number to an ms string
 */
interface numberToMs {
  (num: number): string;
}
export const numToMs: numberToMs = num => `${num}ms`;

/**
 * Convert an rgb theme property (e.g. rgbBlack: '0 0 0')
 * to values that can be spread into a ThreeJS Color class
 */
interface rgbToThree {
  (rgb: string): number[];
}
export const rgbToThreeColor: rgbToThree = rgb =>
  rgb?.split(' ').map(value => Number(value) / 255) || [];

/**
 * Convert a JS object into `--` prefixed css custom properties.
 * Optionally pass a second param for normal styles
 */
interface cssProps {
  (props: { [key: string]: string | number }, styles?: object): object;
}
export const cssProps: cssProps = (props, style = {}) => {
  let result: { [key: string]: string | number } = {};

  const keys = Object.keys(props);

  for (const key of keys) {
    let value = props[key];

    if (typeof value === 'number' && key === 'delay') {
      value = numToMs(value);
    }

    if (typeof value === 'number' && key !== 'opacity') {
      value = numToPx(value);
    }

    result[`--${key}`] = value;
  }

  return { ...result, ...style };
};

/**
 * Concatenate classNames together
 */
interface classNames {
  (...args: string[]): string;
}
export const classes: classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};
