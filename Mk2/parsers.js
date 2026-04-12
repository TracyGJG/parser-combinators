// Parser:: state => state
// State:: String:input, String:error, Integer:index

import {
  isInError,
  advanceState,
  nextChar,
  endOfInput,
  errorState,
} from '../utils.js';

import {
  isDecimalPoint,
  isDigit,
  isEscapeChar,
  isExponentChar,
  isLeadingDigit,
  isNegative,
  isPrintableChar,
  isSignChar,
  isStringDelim,
  isUnicodeChar,
  isWhitespaceChar,
  isZero,
} from '../predicates.js';

function isUpdated(parser, state) {
  const index = state.index;
  parser(state);
  return !isInError(state) && index < state.index;
}

export function isValue(state) {}

export function isArray(state) {}

export function isObject(state) {}

export function isNumber(state) {
  if (isUpdated(isInteger, state)) {
    isFraction(state);
    isExponent(state);
  }
  return state;
}

function isInteger(state) {
  if (endOfInput(state) || isInError(state)) return state;

  if (isNegative(nextChar(state))) advanceState(state);
  if (endOfInput(state)) return state;

  if (isZero(nextChar(state))) {
    return advanceState(state);
  } else if (!isLeadingDigit(nextChar(state))) {
    return errorState(state, 'Invalid numeric.');
  }
  advanceState(state);

  while (!endOfInput(state) && isDigit(nextChar(state))) {
    advanceState(state);
  }

  return state;
}

function isFraction(state) {
  if (endOfInput(state) || isInError(state) || !isDecimalPoint(nextChar(state)))
    return state;
  advanceState(state);

  if (endOfInput(state) || !isDigit(nextChar(state)))
    return errorState(state, 'Invalid numeric (fraction.)');
  advanceState(state);

  while (!endOfInput(state) && isDigit(nextChar(state))) {
    advanceState(state);
  }
  return state;
}

function isExponent(state) {
  if (endOfInput(state) || isInError(state) || !isExponentChar(nextChar(state)))
    return state;
  advanceState(state);

  if (endOfInput(state))
    return errorState(state, 'Invalid numeric (exponent.)');
  if (isSignChar(nextChar(state))) advanceState(state);

  if (endOfInput(state) || !isDigit(nextChar(state)))
    return errorState(state, 'Invalid numeric (exponent.)');
  advanceState(state);

  while (!endOfInput(state) && isDigit(nextChar(state))) {
    advanceState(state);
  }
  return state;
}

export function isString(state) {
  if (endOfInput(state) || isInError(state) || !isStringDelim(nextChar(state)))
    return state;
  advanceState(state);

  while (!endOfInput(state) && !isInError(state)) {
    if (isPrintableChar(nextChar(state))) {
      advanceState(state);
    } else if (isEscapeChar(nextChar(state, 2))) {
      advanceState(state, 2);
    } else if (isUnicodeChar(nextChar(state, 6))) {
      advanceState(state, 6);
    } else break;
  }

  if (endOfInput(state) || isInError(state)) {
    return errorState(state, 'Unexpected end of input');
  }
  if (!isStringDelim(nextChar(state))) {
    return errorState(state, 'String is not delimited');
  }
  return advanceState(state);
}

export function isWhitespace(state) {
  while (
    !endOfInput(state) &&
    !isInError(state) &&
    isWhitespaceChar(nextChar(state))
  ) {
    advanceState(state);
  }
  return state;
}
