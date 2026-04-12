import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { base, string, array, object, number, value } from '../src/parsers.js';

describe.skip('Parsers', () => {
  describe.skip('base', () => {
    test('passes when parsering Boolean true (no whitespace)', () => {
      const testState = {
        text: 'true_',
        index: 0,
        isMatched: true,
      };
      assert.ok(base(testState));
      assert.deepEqual(testState, {
        text: 'true_',
        index: 4,
        isMatched: true,
      });
    });

    test('passes when parsering Boolean true (with whitespace)', () => {
      const testState = {
        text: '  true_',
        index: 0,
        isMatched: true,
      };
      assert.ok(base(testState));
      assert.deepEqual(testState, {
        text: '  true_',
        index: 6,
        isMatched: true,
      });
    });

    test('passes when parsering Boolean false', () => {
      const testState = {
        text: 'false_',
        index: 0,
        isMatched: true,
      };
      assert.ok(base(testState));
      assert.deepEqual(testState, {
        text: 'false_',
        index: 5,
        isMatched: true,
      });
    });

    test('passes when parsering Null value', () => {
      const testState = {
        text: 'null_',
        index: 0,
        isMatched: true,
      };
      assert.ok(base(testState));
      assert.deepEqual(testState, {
        text: 'null_',
        index: 4,
        isMatched: true,
      });
    });

    test('fails when parsering the string "true"', () => {
      const testState = {
        text: '"true"',
        index: 0,
        isMatched: true,
      };
      assert.ok(!base(testState));
      assert.deepEqual(testState, {
        text: '"true"',
        index: 0,
        isMatched: true,
      });
    });

    test('fails when parsering Undefined value', () => {
      const testState = {
        text: 'undefined',
        index: 0,
        isMatched: true,
      };
      assert.ok(!base(testState));
      assert.deepEqual(testState, {
        text: 'undefined',
        index: 0,
        isMatched: true,
      });
    });
  });

  describe('array', () => {
    test.skip('passes when parsering an empty array', () => {
      const testState = {
        text: '[]',
        index: 0,
        isMatched: true,
      };
      assert.ok(array(testState));
      assert.deepEqual(testState, {
        text: '[]',
        index: 2,
        isMatched: true,
      });
    });
    test.skip('passes when parsering a single item array', () => {
      const testState = {
        text: '["__"]',
        index: 0,
        isMatched: true,
      };
      assert.ok(array(testState));
      assert.deepEqual(testState, {
        text: '["__"]',
        index: 6,
        isMatched: true,
      });
    });
    test('passes when parsering a multi-item array', () => {
      const testState = {
        text: '["__", "__"]',
        index: 0,
        isMatched: true,
      };
      assert.ok(array(testState));
      assert.deepEqual(testState, {
        text: '["__", "__"]',
        index: 12,
        isMatched: true,
      });
    });
  });

  describe.skip('object', () => {
    test('passes when parsering an empty object', () => {
      const testState = {
        text: '{}',
        index: 0,
        isMatched: true,
      };
      assert.ok(object(testState));
      assert.deepEqual(testState, {
        text: '{}',
        index: 2,
        isMatched: true,
      });
    });
    test('passes when parsering a single-item object', () => {
      const testState = {
        text: '{"Dont Panic":42}',
        index: 0,
        isMatched: true,
      };
      assert.ok(object(testState));
      assert.deepEqual(testState, {
        text: '{"Dont Panic":42}',
        index: 17,
        isMatched: true,
      });
    });
    test('passes when parsering a multi-item object', () => {
      const testState = {
        text: '{"Dont Panic":42, "Beast": 666 }',
        index: 0,
        isMatched: true,
      };
      assert.ok(object(testState));
      assert.deepEqual(testState, {
        text: '{"Dont Panic":42, "Beast" : 666 }',
        index: 33,
        isMatched: true,
      });
    });
  });

  describe.skip('string', () => {
    test('passes when parsering an empty string', () => {
      const testState = {
        text: '""',
        index: 0,
        isMatched: true,
      };
      assert.ok(string(testState));
      assert.deepEqual(testState, {
        text: '""',
        index: 2,
        isMatched: true,
      });
    });
    test('passes when parsering a printable string', () => {
      const testState = {
        text: '"ABC"',
        index: 0,
        isMatched: true,
      };
      assert.ok(string(testState));
      assert.deepEqual(testState, {
        text: '"ABC"',
        index: 5,
        isMatched: true,
      });
    });
    test('passes when parsering an escape string', () => {
      const testState = {
        text: '"\\t"',
        index: 0,
        isMatched: true,
      };
      assert.ok(string(testState));
      assert.deepEqual(testState, {
        text: '"\\t"',
        index: 4,
        isMatched: true,
      });
    });
    test('passes when parsering a unicode string', () => {
      const testState = {
        text: '"\\uABCD"',
        index: 0,
        isMatched: true,
      };
      assert.ok(string(testState));
      assert.deepEqual(testState, {
        text: '"\\uABCD"',
        index: 8,
        isMatched: true,
      });
    });
    test('passes when parsering a combination string', () => {
      const testState = {
        text: '"Test: \\t\\uABCD\\n"',
        index: 0,
        isMatched: true,
      };
      assert.ok(string(testState));
      assert.deepEqual(testState, {
        text: '"Test: \\t\\uABCD\\n"',
        index: 18,
        isMatched: true,
      });
    });
  });

  describe.skip('number', () => {
    test('passes when parsering an integer (zero)', () => {
      const testState = {
        text: '0',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '0',
        index: 1,
        isMatched: true,
      });
    });
    test('passes when parsering an integer (negative)', () => {
      const testState = {
        text: '-1',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '-1',
        index: 2,
        isMatched: true,
      });
    });
    test('passes when parsering an integer (positive)', () => {
      const testState = {
        text: '42',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '42',
        index: 2,
        isMatched: true,
      });
    });
    test('passes when parsering a fraction', () => {
      const testState = {
        text: '42.10',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '42.10',
        index: 5,
        isMatched: true,
      });
    });
    test('passes when parsering an exponential (e without sign)', () => {
      const testState = {
        text: '0e42',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '0e42',
        index: 4,
        isMatched: true,
      });
    });
    test('passes when parsering an exponential (e with sign)', () => {
      const testState = {
        text: '0e+42',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '0e+42',
        index: 5,
        isMatched: true,
      });
    });
    test('passes when parsering an exponential (E with sign)', () => {
      const testState = {
        text: '0E-42',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '0E-42',
        index: 5,
        isMatched: true,
      });
    });
    test('passes when parsering a complete number', () => {
      const testState = {
        text: '1.2E34',
        index: 0,
        isMatched: true,
      };
      assert.ok(number(testState));
      assert.deepEqual(testState, {
        text: '1.2E34',
        index: 6,
        isMatched: true,
      });
    });
  });

  describe.skip('value', () => {
    test('fails when parsering missing data', () => {
      const testState = {
        text: '',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '',
        index: 0,
        isMatched: true,
      });
    });

    test('fails when parsering whitespace only', () => {
      const testState = {
        text: '    ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '    ',
        index: 4,
        isMatched: true,
      });
    });

    test('passes when parsering an empty array', () => {
      const testState = {
        text: '  []   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  []   ',
        index: 4,
        isMatched: true,
      });
    });

    test('passes when parsering a populated array (single)', () => {
      const testState = {
        text: '  ["ABC"]   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  ["ABC"]   ',
        index: 9,
        isMatched: true,
      });
    });

    test('passes when parsering a populated array (multi)', () => {
      const testState = {
        text: '  ["ABC","DEF"]   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  ["ABC","DEF"]   ',
        index: 15,
        isMatched: true,
      });
    });

    test('passes when parsering an empty object', () => {
      const testState = {
        text: '  {    }   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  {    }   ',
        index: 8,
        isMatched: true,
      });
    });

    test('passes when parsering a single key-val object', () => {
      const testState = {
        text: '  {"key":"val"}   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  {"key":"val"}   ',
        index: 15,
        isMatched: true,
      });
    });

    test('passes when parsering a multi key-val object', () => {
      const testState = {
        text: '  {"key":"val", "prop": 42 }   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  {"key":"val", "prop": 42 }   ',
        index: 28,
        isMatched: true,
      });
    });

    test('passes when parsering an empty string', () => {
      const testState = {
        text: '  ""   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  ""   ',
        index: 4,
        isMatched: true,
      });
    });

    test('passes when parsering a populated string', () => {
      const testState = {
        text: '  "ABC"   ',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  "ABC"   ',
        index: 7,
        isMatched: true,
      });
    });

    test('passes when parsering Boolean true', () => {
      const testState = {
        text: '  true',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '  true',
        index: 6,
        isMatched: true,
      });
    });

    test('passes when parsering a complete number', () => {
      const testState = {
        text: '1.2E34',
        index: 0,
        isMatched: true,
      };
      assert.ok(value(testState));
      assert.deepEqual(testState, {
        text: '1.2E34',
        index: 6,
        isMatched: true,
      });
    });
  });
});
