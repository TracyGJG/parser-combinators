import { advance, endOfInput, error, nextChar, parser } from './utils.js';

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

// export function parseString(state) {
//   const parserQuotation = parser(isChars(`"`));
//   let newState = state;

//   if (newState.error || endOfInput(newState)) return newState;

//   newState = parserQuotation(newState);
//   if (newState.error || endOfInput(newState)) return state;

//   return newState;
// }

export function parseWhitespace(state) {
  let newState = state;
  const _parser = parser(isWhitespace, '');

  while (!newState.error && !endOfInput(newState)) {
    newState = _parser(newState);
  }
  return newState;
}
