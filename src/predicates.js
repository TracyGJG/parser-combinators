export const matchText =
  (...patterns) =>
  (text = '') =>
    !!text.length &&
    patterns.some((pattern) => pattern.includes(text.slice(0, pattern.length)));

// Base Values
export const isBooleanTrue = matchText('true');
export const isBooleanFalse = matchText('false');
export const isNullValue = matchText('null');

// Whitespaces
export const isSpace = matchText(' ');
export const isLitLinefeed = matchText('\n');
export const isLitCarriageReturn = matchText('\r');
export const isLitHorizontalTab = matchText('\t');

// Array
export const isArrayStart = matchText('[');
export const isArrayEnd = matchText(']');
export const isArraySeparator = matchText(',');

// Object
export const isObjectStart = matchText('{');
export const isObjectEnd = matchText('}');
export const isObjectSeparator = matchText(',');
export const isObjectKeyValSep = matchText(':');

// Number - Integer
export const isMinusSign = matchText('-');
export const isZero = matchText('0');
export const isPositiveDigit = matchText(...'123456789');
export const isSingleDigit = matchText(...'0123456789');
// Number - Fraction
export const isDecimalPoint = matchText('.');
// Number - Exponent
export const isExponentSign = matchText(...'eE');
export const isArithmeticSigns = matchText(...'-+');

// String
const UNICODE_LENGTH = 6;
export const isStringDelim = matchText('"');
const isEscapePrefix = matchText('\\');
const isControlChar = matchText(
  ...`\u007F${String.fromCharCode(...Array(32).keys())}`,
);
export const isPrintableChar = (text) =>
  !(isControlChar(text) || isStringDelim(text) || isEscapePrefix(text));
const isQuotationMark = matchText('\\"');
const isReversSolidus = matchText('\\\\');
const isSolidus = matchText('\\/');
const isBackspace = matchText('\\b');
const isFormfeed = matchText('\\f');
const isLinefeed = matchText('\\n');
const isCarriageReturn = matchText('\\r');
const isHorizontalTab = matchText('\\t');
export const isEscaped = (text) =>
  [
    isQuotationMark,
    isReversSolidus,
    isSolidus,
    isBackspace,
    isFormfeed,
    isLinefeed,
    isCarriageReturn,
    isHorizontalTab,
  ].some((pred) => pred(text));
const isUnicodePrefix = matchText('\\u');
const isHexDigit = matchText(...'0123456789ABCDEFabcdef');
export const isUnicode = (text) =>
  text.length >= UNICODE_LENGTH &&
  isUnicodePrefix(text) &&
  [...text.slice(2, UNICODE_LENGTH)].every(isHexDigit);

export function consumeWhitespace(state) {
  while (
    [isSpace, isLitLinefeed, isLitCarriageReturn, isLitHorizontalTab].some(
      (pred) => pred(state.text.at(state.index)),
    )
  ) {
    state.index++;
  }
}
