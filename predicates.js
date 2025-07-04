const ALPHABETIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const HEXDIGITS = ALPHABETIC.slice(0, 6);

export const isChars = (chars) => (data) => chars.includes(data.at(0));

export const isAlphanumeric = isChars(
  `${DIGITS}${ALPHABETIC.toLowerCase()}${ALPHABETIC}`
);
export const isDigit_0_9 = isChars(DIGITS);
export const isDigit_1_9 = isChars(`${DIGITS.slice(1)}`);
export const isEscapeChar = isChars('"/\\\b\f\n\r\t');
export const isHexadecimal = isChars(
  `${DIGITS}${HEXDIGITS.toLowerCase()}${HEXDIGITS}`
);
export const isNonPrintable = (data) => {
  const charCode = data.charCodeAt(0);
  return charCode === 127 || charCode < 32;
};
export const isWhitespace = isChars(' \b\n\r\t');

// export const isUnicodeChar = (data) =>
//   data.length >= 5 &&
//   isChars('u')(data.at(0)) &&
//   [...data.slice(1, 5)].every(isHexadecimal);
