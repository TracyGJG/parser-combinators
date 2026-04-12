import {
  isAlphanumeric,
  isChars,
  isDigit_0_9,
  isDigit_1_9,
  isEscapeChar,
  isNonPrintable,
  // isUnicodeChar,
  isWhitespace,
} from './predicates.js';

import { advance, endOfInput, error, nextChar, parser } from './utils.js';

// export function Run(parser) {
//   return (srcData) =>
//     parser({
//       data: srcData.trim(),
//       index: 0,
//       error: '',
//     });
// }

// export function Sequence(...parsers) {
//   let parserIndex = 0;
//   return (state) => {
//     let newState = state;
//     while (
//       !newState.error &&
//       !endOfInput(newState) &&
//       parserIndex < parsers.length
//     ) {
//       newState = parsers[parserIndex](newState);
//       parserIndex++;
//     }
//     return newState;
//   };
// }

// export function Repeat(parser, options = {}) {
//   const { min, max } = { min: 1, max: 1, ...options };

//   return (state) => {
//     let newState = state;
//     let occurrence = 0;

//     while (!newState.error && !endOfInput(newState) && occurrence <= max) {
//       newState = parser(newState);
//       occurrence++;
//     }
//     return {
//       ...newState,
//       error: occurrence > min ? '' : newState.error,
//     };
//   };
// }

// export function Optional(parser) {
//   return (state) => (state.error ? state : { ...parser(state), error: '' });
// }

// export const isValidStringChar = (data) =>
//   !('"\\'.includes(data.at(0)) || isNonPrintable(data)) ||
//   isEscapeChar(data) ||
//   isUnicodeChar(data);

// ====

export function parseNumber(state) {
  let newState = state;
  parseInteger(newState);
  if (newState.error || state.index === newState.index) return state;

  parseFraction(newState);
  if (newState.error) return state;

  parseExponent(newState);
  if (newState.error) return state;
  return newState;
}

export function parseInteger(state) {
  let newState = state;
  if (isChars('-')(nextChar(newState))) {
    newState = advance(newState);
    if (endOfInput(newState)) {
      return error(newState, 'Unexpected End of Input');
    }
  }
  if (isChars('0')(nextChar(newState))) {
    return advance(newState);
  }
  if (isDigit_1_9(nextChar(newState))) {
    newState = advance(newState);
    while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
      newState = advance(newState);
    }
    return newState;
  } else {
    return error(newState, 'Invalid integer');
  }
}

export function parseFraction(state) {
  let newState = state;
  if (isChars('.')(nextChar(newState))) {
    newState = advance(newState);
    if (endOfInput(newState)) {
      return error(newState, 'Unexpected End of Input');
    }

    if (isDigit_0_9(nextChar(newState))) {
      newState = advance(newState);
    } else {
      return error(newState, 'Invalid fraction');
    }
    while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
      newState = advance(newState);
    }
    return newState;
  }
  return state;
}

export function parseExponent(state) {
  let newState = state;
  if (isChars('eE')(nextChar(newState))) {
    newState = advance(newState);
    if (endOfInput(newState)) {
      return error(newState, 'Unexpected End of Input');
    }
    if (isChars('+-')(nextChar(newState))) {
      newState = advance(newState);
      if (endOfInput(newState)) {
        return error(newState, 'Unexpected End of Input');
      }
    }
    if (isDigit_0_9(nextChar(newState))) {
      newState = advance(newState);
    } else {
      return error(newState, 'Invalid exponent');
    }
    while (!endOfInput(newState) && isDigit_0_9(nextChar(newState))) {
      newState = advance(newState);
    }
    return newState;
  }
  return state;
}

// export function parseWhitespace(state) {
//   let newState = state;
//   while (
//     !newState.error &&
//     !endOfInput(newState) &&
//     isWhitespace(nextChar(newState))
//   ) {
//     newState = advance(newState);
//   }
//   return newState;
// }
