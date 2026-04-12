// Array
const ARRAY_START = '[';
const ARRAY_END = ']';
const VALUE_SEPARATER = ',';

// Number
const NEGATIVE = '-';
const ZERO_DIGIT = '0';
const NONZERO_DIGITS = '123456789';
const DECIMAL_POINT = '.';
const EXPONENT = 'Ee';
const SIGN = '-+';

// Object
const OBJECT_START = '{';
const OBJECT_END = '}';
const KEY_SEPARATER = ':';

// String
const STRING_DELIM = '"';
const CONTROL_CHARS = `\u007F${String.fromCharCode(...Array(32).keys())}`;
const ESCAPE_PREFIX = '\\';
const ESCAPE_CHARS = `${STRING_DELIM}${ESCAPE_PREFIX}/bfnrt`;
const ESCAPE_UNICODE = 'u';
const HEX_LETTERS = 'abcdef';

// Value
const TRUE = 'true';
const FALSE = 'false';
const NULL = 'null';

// Whitespace
const WHITESPACE_CHARS = ' \n\r\t';

// ============================

const isChar =
  (...chars) =>
  (char) =>
    chars.join('').includes(char);

// ============================

// Predicate:: pattern => input => Boolean

// --------- Array
export const isArrayStart = isChar(ARRAY_START);
export const isArrayEnd = isChar(ARRAY_END);
export const isValueSeparater = isChar(VALUE_SEPARATER);

// --------- Number
export const isNegative = isChar(NEGATIVE);
export const isZero = isChar(ZERO_DIGIT);
export const isLeadingDigit = isChar(NONZERO_DIGITS);
export const isDigit = isChar(ZERO_DIGIT, NONZERO_DIGITS);
// Fraction
export const isDecimalPoint = isChar(DECIMAL_POINT);
// Exponent
export const isExponentChar = isChar(EXPONENT);
export const isSignChar = isChar(SIGN);

// --------- Object
export const isObjectStart = isChar(OBJECT_START);
export const isObjectEnd = isChar(OBJECT_END);
export const isKeySeparater = isChar(KEY_SEPARATER);

// --------- String
export const isStringDelim = isChar(STRING_DELIM);
const isControlChar = isChar(CONTROL_CHARS);
const isEscapePrefix = isChar(ESCAPE_PREFIX);
//
export const isPrintableChar = (char) =>
  !(isControlChar(char) || isStringDelim(char) || isEscapePrefix(char));
//
export const isEscapeChar = (string) =>
  string.length === 2 &&
  isEscapePrefix(string[0]) &&
  isChar(ESCAPE_CHARS)(string[1]);
const isHexDigit = isChar(
  ZERO_DIGIT,
  NONZERO_DIGITS,
  HEX_LETTERS,
  HEX_LETTERS.toUpperCase()
);
//
export const isUnicodeChar = (string) =>
  string.length === 6 &&
  isEscapePrefix(string[0]) &&
  isChar(ESCAPE_UNICODE)(string[1]) &&
  isHexDigit(string[2]) &&
  isHexDigit(string[3]) &&
  isHexDigit(string[4]) &&
  isHexDigit(string[5]);

// --------- Values
const isString = (pattern) => (string) => string === pattern;
export const isTrue = isString(TRUE);
export const isFalse = isString(FALSE);
export const isNull = isString(NULL);

// --------- Whitespace
export const isWhitespaceChar = isChar(WHITESPACE_CHARS);
