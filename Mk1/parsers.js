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
  let newState = parserQuotation(state);

  if (notCandidate(state, newState)) return state;

  while (!newState.error && !endOfInput(newState)) {
    newState = parser(isAlphanumeric)(newState);

    if (isChars('\\')(nextChar(newState))) {
      newState = advance(newState);
      newState = parser(isEscapeChar)(newState);

      if (newState.error) {
        newState = parser(isChars('u'))(error(newState));
        newState = parser(isHexadecimal)(newState, 'Invaild Unicode.');
        newState = parser(isHexadecimal)(newState, 'Invaild Unicode.');
        newState = parser(isHexadecimal)(newState, 'Invaild Unicode.');
        newState = parser(isHexadecimal)(newState, 'Invaild Unicode.');
      }
    }
  }
  return parserQuotation(error(newState), 'Invalid String');
}

export function parseWhitespace(state) {
  let newState = state;
  const _parser = parser(isWhitespace);

  while (!newState.error && !endOfInput(newState)) {
    newState = _parser(newState);
  }
  return error(newState);
}
