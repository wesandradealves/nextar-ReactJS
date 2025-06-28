export const pxToRem = (px: number, basefontSize: number = 16): string => {
    return `${px / basefontSize}rem`;
};
  