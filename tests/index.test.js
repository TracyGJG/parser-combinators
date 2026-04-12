import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import jsonParser from '../src/index.js';

import testcases from './jsonParser.json' with { type: 'json' };

describe.skip('JSON Parser', () => {
  describe('fails when given', () => {
    test('no data', () => {
      assert.ok(!jsonParser(testcases.noData));
    });

    test('only whitespace', () => {
      assert.ok(!jsonParser(testcases.onlyWhitespace));
    });
  });

  describe('passes when given an empty:', () => {
    test('string', () => {
      assert.ok(jsonParser(testcases.emptyString));
    });

    test('array', () => {
      assert.ok(jsonParser(testcases.emptyArray));
    });

    test('object', () => {
      assert.ok(jsonParser(testcases.emptyObject));
    });
  });

  describe('passes when given Base Values of:', () => {
    test('Boolean true', () => {
      assert.ok(jsonParser(testcases.BooleanTrue));
    });

    test('Boolean false', () => {
      assert.ok(jsonParser(testcases.BooleanFalse));
    });

    test('Null value', () => {
      assert.ok(jsonParser(testcases.BaseValueNull));
    });
  });

  describe('passes when given a Printable String', () => {
    test('plain text', () => {
      assert.ok(jsonParser(testcases.printableStringPlainText));
    });

    test('whitespace', () => {
      assert.ok(jsonParser(testcases.printableStringWhitespace));
    });

    test('unicode', () => {
      assert.ok(jsonParser(testcases.printableStringUnicode));
    });
  });

  describe('passes when given a Number', () => {
    test('integer:zero', () => {
      assert.ok(jsonParser(testcases.numberIntegerOnlyZero));
    });

    test('integer:positive', () => {
      assert.ok(jsonParser(testcases.numberIntegerMultiDigit));
    });

    test('integer:minus', () => {
      assert.ok(jsonParser(testcases.numberIntegerOnlyMinusOne));
    });

    test('fraction', () => {
      assert.ok(jsonParser(testcases.numberFraction));
    });

    test('exponent', () => {
      assert.ok(jsonParser(testcases.numberExponent));
    });

    test('complete', () => {
      assert.ok(jsonParser(testcases.numberComplete));
    });
  });
});
