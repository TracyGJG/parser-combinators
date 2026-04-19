import { EOI, reportError, inError, prepareInput } from './utils.js';

// COMBINATORS
function combinator(method) {
  return (...parsers) =>
    (state) =>
      parsers[method]((parser) => parser(state)) && state;
}
export function or(...parsers) {
  return combinator('some')(...parsers);
}
export function and(...parsers) {
  return combinator('every')(...parsers);
}

function repeat(options = {}) {
  const { min, max } = { min: 0, max: Infinity, ...options };
  return (parser) => (state) => {
    let occ = 0;
    while (!EOI(state) && parser(state)) {
      if (++occ === max) break;
    }
    return (!min || occ >= min) && state;
  };
}
export const optional = repeat();
export const oneZero = repeat({ max: 1 });
export const onePlus = repeat({ min: 1 });

function combine(combiner = (_) => _) {
  return (...parsers) =>
    (state) => {
      if (inError(state)) return state;
      const newState = prepareInput(state.text.slice(state.index));
      const result = and(...parsers)(newState);
      if (!result) return result;

      if (newState.results.length) {
        state.index += newState.index;
        state.results.push(combiner(newState.results));
      }
      state.error = newState.error;
      return state;
    };
}
const joinValues = (arr) => arr.join('');

export const consolidate = combine(joinValues);
export const compress = combine();
