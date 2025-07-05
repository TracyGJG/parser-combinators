import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  advance,
  endOfInput,
  error,
  nextChar,
  notCandidate,
  parser,
} from './utils.js';

describe('Utils', () => {
  describe('advance', () => {
    it('can increase the index of the state', () => {
      assert.equal(advance({ index: 0 }).index, 1);
    });
  });

  describe('endOfInput', () => {
    it('can confirm when the index is with range (0)', () => {
      assert.equal(endOfInput({ data: 'Hello, World!', index: 0 }), false);
    });

    it('can confirm when the index is with range (5)', () => {
      assert.equal(endOfInput({ data: 'Hello, World!', index: 5 }), false);
    });

    it('can confirm when the index exceeds the data', () => {
      assert.equal(endOfInput({ data: 'Hello, World!', index: 13 }), true);
    });
  });

  describe('error', () => {
    it('can return when there is no error', () => {
      assert.equal(
        error({ data: 'Hello, World!', index: 13, error: '' }).error,
        ''
      );
    });
    it('can return when there is a reportable error', () => {
      assert.equal(
        error(
          { data: 'Hello, World!', index: 13, error: '' },
          'Data exhausted.'
        ).error,
        'Error at 13: Data exhausted.'
      );
    });
    it('can return when there is a non-reportable error', () => {
      assert.equal(
        error({ data: 'Hello, World!', index: 13, error: '' }, '_').error,
        '_'
      );
    });
  });

  describe('nextChar', () => {
    it('can return the next datum', () => {
      assert.equal(nextChar({ data: 'Hello, World!', index: 5 }), ',');
    });

    it('can return an empty string when data is exhausted', () => {
      assert.equal(nextChar({ data: 'Hello, World!', index: 13 }), '');
    });
  });

  describe('notCandidate', () => {
    it('can return when unchanged', () => {
      assert.equal(notCandidate({ index: 5 }, { index: 5 }), false);
    });
    it('can return when progressed', () => {
      assert.equal(notCandidate({ index: 5 }, { index: 6 }), true);
    });
  });

  describe('parser', () => {
    it('can convert a predicate into a parser', () => {
      const testPredicate = () => {};
      const testParser = parser(testPredicate);
      assert.ok(testParser);
    });

    it('can processes EndOfInput state', () => {
      const state = { data: 'Hello, World!', index: 13, error: '' };
      const testPredicate = () => {};
      const testParser = parser(testPredicate);
      assert.equal(testParser(state), state);
    });

    it('can processes Error state', () => {
      const state = { data: 'Hello, World!', index: 5, error: 'In Error' };
      const testPredicate = () => {};
      const testParser = parser(testPredicate);
      assert.equal(testParser(state), state);
    });

    it('can advance index on valid state', () => {
      const state = { data: 'Hello, World!', index: 0, error: '' };
      const testPredicate = (_) => _ === 'H';
      const testParser = parser(testPredicate);
      assert.equal(testParser(state).index, 1);
      assert.equal(testParser(state).error, '');
    });

    it('can error when in an invalid state', () => {
      const state = { data: 'Hello, World!', index: 1, error: '' };
      const testPredicate = (_) => _ === 'H';
      const testParser = parser(testPredicate, 'In Error');
      assert.equal(testParser(state).index, 1);
      assert.equal(testParser(state).error, 'Error at 1: In Error');
    });
  });
});
