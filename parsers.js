import { advance, error, endOfInput, nextChar } from './combinators.js';
import {
  // isAlphanumeric,
  isChars,
  isDigit_0_9,
  isDigit_1_9,
  isEscapeChar,
  isNonPrintable,
  isUnicodeChar,
  isWhitespace,
} from './predicates.js';

function genericParser(predicate, errorMessage) {
  return (state) =>
    predicate(nextChar(state)) ? advance(state) : error(state, errorMessage);
}

export function parseArray(state) {
  if (!isChars('[')(nextChar(state))) return state;

  let newState = advance(state);
  if (endOfInput(newState)) return error(newState, 'Unexpected End of Input');

  newState = parseWhitespace(newState);

  if (endOfInput(newState)) {
    return error(newState, 'Unexpected End of Input');
  }
  if (isChars(']')(nextChar(newState))) {
    return advance(newState);
  } else {
    return error(newState, 'Missing end of array character');
  }

  return newState;
}

export function parseNumber(state) {
  let newState = parseInteger(state);
  if (newState.error || state.index === newState.index) return newState;

  newState = parseFraction(newState);
  if (newState.error) return newState;

  return parseExponent(newState);
}

function parseInteger(state) {
  let newState = state;
  if (isChars('-')(nextChar(newState))) {
    newState = advance(newState);
    if (endOfInput(newState)) {
      return error(newState, 'Unexpected End of Input');
    }
  }
  if (isChars('0')(nextChar(newState))) return advance(newState);

  if (!isDigit_1_9(nextChar(newState)))
    return error(newState, 'Invalid integer');

  while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
    newState = advance(newState);
  }
  return newState;
}

function parseFraction(state) {
  if (!isChars('.')(nextChar(state))) return state;

  let newState = advance(state);
  if (endOfInput(newState)) return error(newState, 'Unexpected End of Input');

  if (!isDigit_0_9(nextChar(newState)))
    return error(newState, 'Invalid fraction');

  while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
    newState = advance(newState);
  }
  return newState;
}

function parseExponent(state) {
  if (!isChars('eE')(nextChar(newState))) return state;

  let newState = advance(state);
  if (endOfInput(newState)) {
    return error(newState, 'Unexpected End of Input');
  }
  if (isChars('+-')(nextChar(newState))) {
    newState = advance(newState);
    if (endOfInput(newState)) return error(newState, 'Unexpected End of Input');
  }
  if (!isDigit_0_9(nextChar(newState)))
    return error(newState, 'Invalid exponent');

  while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
    newState = advance(newState);
  }
  return newState;
}

export function parseObject(state) {
  let newState = state;

  return state;
}

export function parseString(state) {
  if (state.error || endOfInput(state) || !isChars('"')(nextChar(state)))
    return state;

  let newState = advance(state);
  while (!newState.error && !endOfInput(newState)) {
    if (isNonPrintable(nextChar(newState)))
      return error(newState, 'Invalid character encountered');

    if (isChars('"')(nextChar(newState))) return advance(newState);

    if (isChars('\\')(nextChar(newState))) {
      newState = advance(newState);

      if (isEscapeChar(nextChar(newState))) {
        newState = advance(newState);
      } else if (isUnicodeChar(newState.data)) {
        newState = advance(newState, 5);
      } else {
        return error(newState, 'Invalid escape or unicode characater');
      }
    }
    if (endOfInput(newState)) return error(newState, 'Unexpected end of input');
    newState = advance(newState);
  }
  return newState;
}

export function parseValue(state) {
  let newState = state;

  return state;
}

export function parseWhitespace(state) {
  let newState = state;
  while (
    !newState.error &&
    !endOfInput(newState) &&
    isWhitespace(nextChar(newState))
  ) {
    newState = advance(newState);
  }
  return newState;
}
