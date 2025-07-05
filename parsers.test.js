import { describe, it } from 'node:test';
import assert from 'node:assert';

import { parseString, parseWhitespace } from './parsers.js';

describe('Parsers', () => {
  describe('parseString', () => {
    it('can confirm an invalid string', () => {
      const state = { data: ':"",', index: 0, error: '' };
      assert.equal(parseString(state).index, 0);
      assert.equal(parseString(state).error, '');
    });

    it('can confirm an empty string', () => {
      const state = { data: '"",', index: 0, error: '' };
      assert.equal(parseWhitespace(state).index, 2);
      assert.equal(parseWhitespace(state).error, '');
    });
  });

  describe('parseWhitespace', () => {
    it('can confirm whitespace upto non-whitespace', () => {
      const state = { data: ' \b\n\r\t#', index: 0, error: '' };
      assert.equal(parseWhitespace(state).index, 5);
      assert.equal(parseWhitespace(state).error, '');
    });
  });
});
