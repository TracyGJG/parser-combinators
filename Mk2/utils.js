export function isInError(state) {
  return !!state.error;
}

export function advanceState(state, distance = 1) {
  if (isInError(state)) return state;
  if (endOfInput(state, distance))
    return errorState(state, 'Unexpected end of input encountered.');
  state.index += distance;
  return state;
}

export function nextChar(state, length = 1) {
  return isInError(state) || endOfInput(state, length)
    ? null
    : state.input?.slice(state.index, state.index + length);
}

export function endOfInput(state, length = 1) {
  return state.index + length > state.input?.length;
}

export function errorState(state, error) {
  const _error = error ? `Error: ${error}` : error;
  state.error ||= _error;
  return state;
}

export const Parser =
  (predicate, len = 1) =>
  (state) => {
    if (isInError(state)) return state;

    const input = state.input.slice(state.index, state.index + len);

    return input.length === len
      ? advanceState(state, +predicate(input) * len)
      : state;
  };
