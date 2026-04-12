import { errorState } from './utils.js';

// Requires all of the given parsers to pass (advance state)
export function SEQUENCE(error, initialParser, ...parsers) {
  return (state, index = state.index) =>
    initialParser(state).index === index
      ? errorState(state, error)
      : parsers.reduce(
          (_state, parser) => (_state.error ? _state : parser(state)),
          state
        );
}

// Requires any one of the given parsers to pass (advance state)
export function CHOICE(error, ...parsers) {
  return (state, index = state.index) =>
    parsers.every((parser) => parser(state).index === index)
      ? errorState(state, error)
      : state;
}

// Repeates while any one of the given parsers to pass (advance state)
export function MULTIPLE(...parsers) {
  return (state) => {
    let index;
    do {
      index = state.index;
      parsers.reduce((_state, parser) => parser(_state), state);
    } while (state.index > index);
    return state;
  };
}

// Raises an error is the given parser does not advance.
export function REQUIRED(parser, error) {
  return (state, index = state.index) =>
    parser(state).index === index ? errorState(state, error) : state;
}
