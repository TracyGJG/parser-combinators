import { sequence } from './combinators.js';
import { value } from './parsers.js';
import { endOfText } from './utils.js';

export default function jsonParser(text = '') {
  const state = { text, index: 0, isMatched: true };
  return sequence(value, endOfText)(state);
}
