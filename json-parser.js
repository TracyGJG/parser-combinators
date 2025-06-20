import { Run, Sequence, Repeat } from './parser-combinators.js';

const identityParser = (state) => state;

export default function jsonParser(jsonData) {
  return Run(identityParser)(jsonData);
}
