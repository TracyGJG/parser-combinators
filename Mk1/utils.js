export const advance = (state) => ({
  ...state,
  index: state.index + 1,
  error: '',
});

export const endOfInput = (state) => state.index >= state.data.length;

export const error = (state, message = '') => ({
  ...state,
  error: message.length > 1 ? `Error at ${state.index}: ${message}` : message,
});

export const nextChar = (state) =>
  endOfInput(state) ? '' : state.data.at(state.index);

export const parser =
  (predicate, message = '_') =>
  (state) =>
    endOfInput(state) || state.error
      ? state
      : predicate(nextChar(state))
      ? advance(state)
      : error(state, message);

export const notCandidate = ({ index: i1 }, { index: i2 }) => i1 === i2;
