const compoundParsing =
  (method) =>
  (...parsers) =>
  (state) => {
    const index = state.index;
    if (
      parsers[method]((parser) => {
        const result = parser(state);
        state.isMatched = true;
        return result;
      })
    ) {
      return true;
    }
    state.index = index;
    state.isMatched = true;
    return false;
  };

export const sequence = compoundParsing('every');

export const preference = compoundParsing('some');

export function occurance(parser, options = {}) {
  const { min = 0, max = 0 } = options;
  return (state) => {
    let occ = 0;
    let index = state.index;
    while (parser(state)) {
      index = state.index;
      occ++;
      if (max && occ === max) break;
    }
    state.index = index;
    state.isMatched = true;
    return !min || occ >= min;
  };
}
