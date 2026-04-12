import { endOfInput, error, notCandidate } from './utils.js';

export function Sequence(message = '') {}

export function Choice(message = '') {
  return (...parsers) =>
    (state) => {
      let newState = error(state);

      return parsers.some((parser) => {
        newState = parser(newState);
        return newState.error.length > 1;
      })
        ? newState
        : error(newState, message);
    };
}

export function Optional(parser) {
  return (state) => {
    let newState = parser(state);
    return newState.error.length > 1 ? newState : error(newState);
  };
}

export function Repeat(parser) {
  return (state) => {
    let newState = state;
    let orgIndex = state.index - 1;

    while (
      !newState.error &&
      !endOfInput(newState) &&
      orgIndex !== newState.index
    ) {
      orgIndex = newState.index;

      state.error ? state : { ...parser(state), error: '' };
    }
  };
}
