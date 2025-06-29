import {
  Run,
  Sequence,
  Repeat,
  Optional,
  advance,
  error,
  endOfInput,
  nextChar,
} from './combinators.js';

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
