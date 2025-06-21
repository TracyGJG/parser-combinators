import {
  Run,
  Sequence,
  Repeat,
  Optional,
  advance,
  error,
  endOfInput,
  nextChar,
} from './parser-combinators.js';

export const isChars =
  (chars, exclude = false) =>
  ({ data, index }) => {
    const blnCharFound = chars.includes(data.at(index));
    return exclude ? !blnCharFound : blnCharFound;
  };

export const isWhitespace = isChars(' \b\n\r\t');
const isDigit_1_9 = isChars('123456789');
const isDigit_0_9 = isChars('0123456789');
export const isHexadecimal = (data) =>
  [...data].every((_, index) =>
    isChars('0123456789ABCDEFabcdef')({ data, index })
  );
const isAlphanumeric = isChars(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
);
export const isEscapeChar = isChars('"\\\b\f\n\r\t');
export const isUnicodeChar = ({ data, index }) =>
  isString('\\u')({ data, index }) &&
  isHexadecimal(data.slice(index + 2, index + 6));
export const isString = (pattern, caseSensitive = true) => {
  const convert = caseSensitive ? (_) => _ : (_) => _.toLowerCase();
  return ({ data, index }) => {
    const subject = data.slice(index, index + pattern.length);
    return convert(subject) === convert(pattern);
  };
};
const isNonPrintable = ({ data, index }) => {
  const charCode = data.charCodeAt(index);
  return charCode === 127 || charCode < 32;
};
export const isValidStringChar = ({ data, index }) => {
  const stringChar = data.at(index);
  return (
    !('"\\'.includes(stringChar) || isNonPrintable({ data, index })) ||
    isEscapeChar({ data, index }) ||
    isUnicodeChar({ data, index })
  );
};

const jsonParser = Sequence(parseChar('"'), parseString, parseChar('"'));

export default function (jsonData) {
  return Run(jsonParser)(jsonData);
}

function parseChar(char) {
  return (state) =>
    state.data.at(state.index) === char ? advance(state) : error(state);
}

export function parseString(state) {
  if (nextChar(state) !== '"')
    return error(state, 'Initial string delimiter (double-quote) not found.');
  let index = state.index + 1;
  while (
    !endOfInput({ ...state, index }) &&
    isValidStringChar({ ...state, index })
  ) {
    index++;
  }
  if (endOfInput({ ...state, index }))
    return error(state, 'Unexpected end of data encountered.');
  return nextChar({ ...state, index }) === '"'
    ? advance(state, index + 1)
    : error(state, 'Closing string delimiter (double-quote) not found.');
}

export function parseWhitespace(state) {
  let index = state.index;
  while (
    !endOfInput({ ...state, index }) &&
    isWhitespace({ ...state, index })
  ) {
    index++;
  }
  return { ...state, index };
}

/*
Object - Sequ
  chars {
  choice
    Whitespace
    Sequ
      Whitespace
      string
      Whitespace
      chars :
      value
      repeat 0+
        Sequ
          chars ,
          Whitespace
          string
          Whitespace
          chars :
          value
  chars }

Array - Sequ
  chars [
  choice
    Whitespace
    sequ
      value
      repeat 0+
        sequ
          chars ,
          value
  chars ]

Value - Sequ
  Whitespace
  choice (1 of)
    String
    number
    object
    array
    string 'true'
    string 'false'
    string 'null'
  Whitespace

string - Sequ
  char "
  repeat 0+
    choice
      string ![ " \ or codes 0-32, 127] - isNonPrintable
      sequ
        chars \
        choice
          escaped
          sequ
            char 'u'
            repeat 4
              alphanumeric
  chars "

number - Sequ
  repeat 0-1
    chars '-'
  choice (one of)
    chars '0'
    sequ
      digits_1_9
      repeat 0+
        digits_0_9
  repeat 0-1
    fraction
  repeat 0-1
    exponent

*fraction - Sequ
  chars '.'
  repeat 1+
    digits_0_9

*exponent - Sequ
  chars 'e'|'E'
  repeat 0-1
  chars '-'|'+'
  repeat 1+
    digits_0_9

Whitespace - Sequ
  repeat 0+
    isWhitespace

*chars charString, ?exclude(Bool)

*/
