import {
  advance,
  endOfInput,
  error,
  nextChar,
  notCandidate,
  parser,
} from './utils.js';

import {
  isAlphanumeric,
  isChars,
  isDigit_0_9,
  isDigit_1_9,
  isEscapeChar,
  isHexadecimal,
  isNonPrintable,
  isWhitespace,
} from './predicates.js';

export function parseString(state) {
  const parserQuotation = parser(isChars(`"`));
  let newState = parserQuotation(newState);

  if (notCandidate(state, newState)) return state;

  // while (newState.error || endOfInput(newState)) return state;

  newState = parserQuotation(newState);

  return newState;
}

export function parseWhitespace(state) {
  let newState = state;
  const _parser = parser(isWhitespace);

  while (!newState.error && !endOfInput(newState)) {
    newState = _parser(newState);
  }
  return newState;
}
