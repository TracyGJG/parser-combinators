export function Run(parser) {
  return (data) =>
    parser({
      data,
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
      parserIndex <= parser.length
    ) {
      newState = parsers[parserIndex++](newState);
    }
    return newState;
  };
}

export function Repeat(parser, options = {}) {
  const { min, max } = { min: 1, max: 1, ...options };

  return (state) => {
    let newState = state;
    let occurrence = 0;

    while (!newState.error && occurrence <= max) {
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

// function parse(parser) {
//   return (state) => (state.error ? state : parser(state));
// }

function endOfInput(state, marker = '') {
  return (
    (marker && state.data.slice(state.index) === marker) ||
    state.index >= state.data.length
  );
}
