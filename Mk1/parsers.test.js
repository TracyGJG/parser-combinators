import { describe, it } from 'node:test';
import assert from 'node:assert';

import { parseString, parseWhitespace } from './parsers.js';

describe('Parsers', () => {
  describe('parseString', () => {
    it('can confirm an invalid string', () => {
      const state = { data: ':"",', index: 0, error: '' };
      const result = parseString(state);
      assert.equal(result.index, 0);
      assert.equal(result.error, '');
    });

    it('can confirm an empty string', () => {
      const state = { data: '"",', index: 0, error: '' };
      const result = parseString(state);
      assert.equal(result.index, 2);
      assert.equal(result.error, '');
    });

    describe('when populated with', () => {
      it('an alphanumeric characters', () => {
        const state = { data: '"ABC"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 5);
        assert.equal(result.error, '');
      });
      it('an escaped characters (tab)', () => {
        const state = { data: '"\\t"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 4);
        assert.equal(result.error, '');
      });
      it('an escaped characters (invalid)', () => {
        const state = { data: '"\\x"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 2);
        assert.equal(result.error, '_');
      });
      it('an escaped characters (quote)', () => {
        const state = { data: '"\\""', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 4);
        assert.equal(result.error, '');
      });
      it('an escaped unicode character', () => {
        const state = { data: '"\\uABCD"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 8);
        assert.equal(result.error, '');
      });
      it('an escaped invalid unicode character', () => {
        const state = { data: '"\\uABCX"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 6);
        assert.equal(result.error, '_');
      });
      it('an escaped truncated unicode character', () => {
        const state = { data: '"\\uABC"', index: 0, error: '' };
        const result = parseString(state);
        assert.equal(result.index, 7);
        assert.equal(result.error, '_');
      });
    });
  });

  describe('parseWhitespace', () => {
    it('can confirm whitespace upto non-whitespace', () => {
      const state = { data: ' \b\n\r\t#', index: 0, error: '' };
      assert.equal(parseWhitespace(state).index, 5);
      assert.equal(parseWhitespace(state).error, '');
    });
    it('can confirm whitespace upto end of input', () => {
      const state = { data: ' \b\n\r\t', index: 0, error: '' };
      assert.equal(parseWhitespace(state).index, 5);
      assert.equal(parseWhitespace(state).error, '');
    });
  });
});
