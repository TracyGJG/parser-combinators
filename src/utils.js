import { consumeWhitespace } from './predicates.js';

export const nextText = (state, stripWhitespace) => {
  stripWhitespace && consumeWhitespace(state);
  return state.text.slice(state.index);
};

export const endOfText = ({ text, index }) =>
  text.length && index >= text.length;

export const parser = (pred, options = {}) => {
  const { size = 1, stripWhitespace = true } = options;
  return (state) => {
    const index = state.index;
    if (state.isMatched) {
      const text = nextText(state, stripWhitespace);
      const extract = text.slice(0, size);
      state.isMatched = pred(extract);
      state.index +=
        (state.text.length - state.index >= size && state.isMatched) * size;
    }
    state.isMatched = state.index !== index;
    return state.isMatched;
  };
};
