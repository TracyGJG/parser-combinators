import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { nextText, endOfText, parser } from '../src/utils.js';

describe.skip('Utils', () => {
  describe('nextText', () => {
    test('returns a string when extracted from the start, without whitespace', () => {
      assert.strictEqual(
        nextText({ text: 'Hello, World!', index: 0 }, false),
        'Hello, World!',
      );
    });
    test('returns a string when extracted from midway', () => {
      assert.strictEqual(
        nextText({ text: 'Hello, World!', index: 7 }, false),
        'World!',
      );
    });
    test('returns an empty string when extracted from the end', () => {
      assert.strictEqual(
        nextText({ text: 'Hello, World!', index: 13 }, false),
        '',
      );
    });
    test('returns a string when extracted from the start, ignoring whitespace', () => {
      assert.strictEqual(
        nextText({ text: ' \t\n\rHello, World!', index: 0 }, true),
        'Hello, World!',
      );
    });
  });

  describe('endOfText', () => {
    test('returns true when at the end of the input text', () => {
      assert.ok(endOfText({ text: 'Hello', index: 5 }));
    });
    test('returns false when not at the end of the input text', () => {
      assert.ok(!endOfText({ text: 'Hello', index: 0 }));
    });
    test('returns false when the input text is an empty string', () => {
      assert.ok(!endOfText({ text: '', index: 0 }));
    });
  });

  describe('parser', () => {
    const testPred = (pattern) => (text) => pattern === text;

    test('returns true when the predicate passes the first char', () => {
      const testParser = parser(testPred('A'));
      const testState = {
        text: 'ABC',
        index: 0,
        isMatched: true,
      };

      assert.ok(testParser(testState));
      assert.strictEqual(testState.index, 1);
    });

    test('returns true when the predicate passes the second char', () => {
      const testParser = parser(testPred('B'));
      const testState = {
        text: 'ABC',
        index: 1,
        isMatched: true,
      };

      assert.ok(testParser(testState));
      assert.strictEqual(testState.index, 2);
    });

    test('returns true when the predicate passes the last char', () => {
      const testParser = parser(testPred('C'));
      const testState = {
        text: 'ABC',
        index: 2,
        isMatched: true,
      };

      assert.ok(testParser(testState));
      assert.strictEqual(testState.index, 3);
    });

    test('returns true when matching the first two chars', () => {
      const testParser = parser(testPred('AB'), { size: 2 });
      const testState = {
        text: 'ABC',
        index: 0,
        isMatched: true,
      };

      assert.ok(testParser(testState));
      assert.strictEqual(testState.index, 2);
    });

    test('returns true when matching the last two chars', () => {
      const testParser = parser(testPred('BC'), { size: 2 });
      const testState = {
        text: 'ABC',
        index: 1,
        isMatched: true,
      };

      assert.ok(testParser(testState));
      assert.strictEqual(testState.index, 3);
    });

    test('returns false when the predicate fails to match the first char', () => {
      const testParser = parser(testPred('X'));
      const testState = {
        text: 'ABC',
        index: 0,
        isMatched: true,
      };

      assert.ok(!testParser(testState));
      assert.strictEqual(testState.index, 0);
      assert.ok(!testState.isMatched);
    });

    test('returns false when the predicate test exceeds available input', () => {
      const testParser = parser(testPred('CD'));
      const testState = {
        text: 'ABC',
        index: 2,
        isMatched: true,
      };

      assert.ok(!testParser(testState));
      assert.strictEqual(testState.index, 2);
      assert.ok(!testState.isMatched);
    });
  });
});
