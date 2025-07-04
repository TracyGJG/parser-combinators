import { describe, it } from 'node:test';
import assert from 'node:assert';

import { parseWhitespace } from './parsers.js';

describe('Parsers', () => {
  describe('parseString', () => {});

  describe('parseWhitespace', () => {
    it('can confirm whitespace upto non-whitespace', () => {
      const state = { data: ' \b\n\r\t#', index: 0, error: '' };
      assert.equal(parseWhitespace(state).index, 5);
      assert.equal(parseWhitespace(state).error, '');
    });
  });
});
