import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { sequence, preference, occurance } from '../src/combinators.js';
import { parser } from '../src/utils.js';
import {
  isArrayStart,
  isArrayEnd,
  isArraySeparator,
} from '../src/predicates.js';

const isChar =
  (...patterns) =>
  (text) =>
    patterns.includes(text);

describe.skip('Combinators', () => {
  describe('sequence', () => {
    const testSeq = sequence(
      parser(isChar('A')),
      parser(isChar('B')),
      parser(isChar('C')),
    );

    test('returns true when given a sequence of parsers', () => {
      const testState = {
        text: 'ABCD',
        index: 0,
        isMatched: true,
      };
      assert.ok(testSeq(testState));
      assert.deepEqual(testState, {
        text: 'ABCD',
        index: 3,
        isMatched: true,
      });
    });

    test('returns false when given a mismatched sequence of parsers', () => {
      const testState = {
        text: 'ABDC',
        index: 0,
        isMatched: true,
      };
      assert.ok(!testSeq(testState));
      assert.deepEqual(testState, {
        text: 'ABDC',
        index: 0,
        isMatched: true,
      });
    });
  });

  describe('preference', () => {
    const testPref = preference(
      parser(isChar('A')),
      parser(isChar('B')),
      parser(isChar('C')),
    );

    test('returns true when given a matching parser', () => {
      const testState = {
        text: 'ABCD',
        index: 0,
        isMatched: true,
      };
      assert.ok(testPref(testState));
      assert.deepEqual(testState, {
        text: 'ABCD',
        index: 1,
        isMatched: true,
      });
    });

    test('returns false when given a mismatched collection of parsers', () => {
      const testState = {
        text: 'ABDC',
        index: 2,
        isMatched: true,
      };
      assert.ok(!testPref(testState));
      assert.deepEqual(testState, {
        text: 'ABDC',
        index: 2,
        isMatched: true,
      });
    });
  });

  describe('occurance', () => {
    const testOccur = occurance(parser(isChar('A', 'B')));

    test('Passes when parsing a multiple tokens (from start)', () => {
      const testState = {
        text: 'ABDC',
        index: 0,
        isMatched: true,
      };
      assert.ok(testOccur(testState));
      assert.deepEqual(testState, {
        text: 'ABDC',
        index: 2,
        isMatched: true,
      });
    });

    test('Passes when parsing a multiple tokens (mid-text)', () => {
      const testState = {
        text: 'ABDC',
        index: 2,
        isMatched: true,
      };
      assert.ok(testOccur(testState));
      assert.deepEqual(testState, {
        text: 'ABDC',
        index: 2,
        isMatched: true,
      });
    });

    test('Passes when parsing a multiple tokens (up to max)', () => {
      const testOccur2 = occurance(parser(isChar('A', 'B')), { max: 3 });
      const testState = {
        text: 'ABAB',
        index: 0,
        isMatched: true,
      };
      assert.ok(testOccur2(testState));
      assert.deepEqual(testState, {
        text: 'ABAB',
        index: 3,
        isMatched: true,
      });
    });

    test('Passes when parsing a multiple tokens (array elements)', () => {
      const testOccur2 = parser(isChar('A', 'B', 'C'));
      function array(state) {
        const additionalValues = occurance(
          sequence(parser(isArraySeparator), testOccur2),
        );
        return sequence(
          parser(isArrayStart),
          occurance(sequence(testOccur2, additionalValues), {
            max: 1,
          }),
          parser(isArrayEnd),
        )(state);
      }
      const testState = {
        text: '[A,B,C ]',
        index: 0,
        isMatched: true,
      };
      const result = array(testState);
      // assert.ok(result);
      assert.deepEqual(testState, {
        text: '[A,B,C ]',
        index: 8,
        isMatched: true,
      });
    });

    test('Pass when unable to parse optional tokens', () => {
      const testState = {
        text: 'XYZ',
        index: 0,
        isMatched: true,
      };
      assert.ok(testOccur(testState));
      assert.deepEqual(testState, {
        text: 'XYZ',
        index: 0,
        isMatched: true,
      });
    });

    test('Fails when unable to parse mandatory tokens', () => {
      const testOccur2 = occurance(parser(isChar('A', 'B')), { min: 1 });
      const testState = {
        text: 'XYZ',
        index: 0,
        isMatched: true,
      };
      assert.ok(!testOccur2(testState));
      assert.deepEqual(testState, {
        text: 'XYZ',
        index: 0,
        isMatched: true,
      });
    });
  });
});
