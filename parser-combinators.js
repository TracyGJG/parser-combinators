export function Run(parser) {
  return (srcData) =>
    parser({
      data: srcData.trim(),
      index: 0,
      error: '',
    });
}

export function Sequence(...parsers) {
  let parserIndex = 0;
  return (state) => {
    let newState = state;
    while (
      !newState.error &&
      !endOfInput(newState) &&
      parserIndex < parsers.length
    ) {
      newState = parsers[parserIndex](newState);
      parserIndex++;
    }
    return newState;
  };
}

export function Repeat(parser, options = {}) {
  const { min, max } = { min: 1, max: 1, ...options };

  return (state) => {
    let newState = state;
    let occurrence = 0;

    while (!newState.error && !endOfInput(newState) && occurrence <= max) {
      newState = parser(newState);
      occurrence++;
    }
    return {
      ...newState,
      error: occurrence > min ? '' : newState.error,
    };
  };
}

export function Optional(parser) {
  return (state) => (state.error ? state : { ...parser(state), error: '' });
}

export function endOfInput(state) {
  return state.index >= state.data.length;
}

export function advance(state, step = 1) {
  return { ...state, index: state.index + step };
}

export function error(state, message = '') {
  return { ...state, error: `Error at ${state.index}: ${message}` };
}

export function nextChar(state) {
  return endOfInput(state) ? null : state.data.at(state.index);
}
