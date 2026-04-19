import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { EOI, readText } from '../src/utils.js';

import jsonParser from '../src/parsers.js';

describe('Parsers JSON', () => {
  describe('returns an error for', () => {
    test('absent content', () => {
      assert.equal(jsonParser('  '), 'Error @0: Unexpected lack of input');
    });
    test('an incomplete string', () => {
      assert.equal(jsonParser('  "  '), 'Error @1: Missing string terminator');
    });
    test('an incomplete array (terminator)', () => {
      assert.equal(jsonParser('  [  '), 'Error @1: Missing array terminator');
    });
    test('an incomplete array (value', () => {
      assert.equal(
        jsonParser('  [ "Hello", '),
        'Error @10: Missing array value',
      );
    });
    test('an incomplete object (end)', () => {
      assert.equal(jsonParser('  {  '), 'Error @1: Missing object terminator');
    });
    test('an incomplete object (separator)', () => {
      assert.equal(
        jsonParser('  { "Hello" '),
        'Error @9: Missing key-value separator',
      );
    });
    test('an incomplete object (property)', () => {
      assert.equal(
        jsonParser('  { "Hello": '),
        'Error @10: Missing property value',
      );
    });
    test('an incomplete object (key-value pair)', () => {
      assert.equal(
        jsonParser('  { "Hello": "World", '),
        'Error @19: Missing object key-value pair',
      );
    });
    test('a number without the fractional digit', () => {
      assert.equal(jsonParser('  1. '), 'Error @2: Missing fractional digit');
    });
    test('a number without the exponent digit', () => {
      assert.equal(jsonParser('  1E '), 'Error @2: Missing exponent digit');
    });
    test('unexpected content', () => {
      assert.equal(
        jsonParser(' "Hello" "World" '),
        'Error @7: Unexpected end of input',
      );
    });
  });

  describe('returns a state object for', () => {
    test('an empty string', () => {
      assert.deepEqual(jsonParser('""'), '""');
    });
    test('a whitespace empty string', () => {
      assert.deepEqual(jsonParser('\t "\n" \r'), '""');
    });
    test('a value of true', () => {
      assert.deepEqual(jsonParser('  true  '), 'true');
    });
    test('a value of false', () => {
      assert.deepEqual(jsonParser('  false  '), 'false');
    });
    test('a value of null', () => {
      assert.deepEqual(jsonParser('  null  '), 'null');
    });
    test('an empty object', () => {
      assert.deepEqual(jsonParser('  {}  '), ['{', '}']);
    });
    test('an empty array', () => {
      assert.deepEqual(jsonParser('  []  '), ['[', ']']);
    });
    test('a single element object', () => {
      assert.deepEqual(jsonParser('  { "Hello": "World" }  '), [
        '{',
        '"Hello"',
        ':',
        '"World"',
        '}',
      ]);
    });
    test('a single element array', () => {
      assert.deepEqual(jsonParser('  [ "Hello, World!" ]  '), [
        '[',
        '"Hello, World!"',
        ']',
      ]);
    });
    test('multi-element object', () => {
      assert.deepEqual(jsonParser('  { "Hello": 42, "World": true }  '), [
        '{',
        '"Hello"',
        ':',
        '42',
        ',',
        '"World"',
        ':',
        'true',
        '}',
      ]);
    });
    test('multi-element array', () => {
      assert.deepEqual(jsonParser('  [ "Hello, World!", 42, true ]  '), [
        '[',
        '"Hello, World!"',
        ',',
        '42',
        ',',
        'true',
        ']',
      ]);
    });
  });
});
