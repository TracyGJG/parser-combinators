import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  State,
  EOI,
  readText,
  advance,
  consumeWhitespace,
  Parser,
} from '../src/utils.js';
import { isSpace, isWhitespace } from '../src/predicates.js';

import {
  or,
  and,
  optional,
  oneZero,
  onePlus,
  consolidate,
} from '../src/combinators.js';

const isTrue = () => true;
const isFalse = () => false;

describe('Combinators', () => {
  describe('Or', () => {
    test('Passes when first parser passes', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isTrue), Parser(isFalse)];
      const orCombinator = or(...parsers);
      const result = orCombinator(state);
      assert.deepEqual(result, {
        text: 'Hello, World!',
        index: 1,
        results: ['H'],
        error: '',
      });
    });
    test('Passes when last parser passes', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isFalse), Parser(isTrue)];
      const orCombinator = or(...parsers);
      const result = orCombinator(state);
      assert.deepEqual(result, {
        text: 'Hello, World!',
        index: 1,
        results: ['H'],
        error: '',
      });
    });
    test('Fails when no parser passes', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isFalse), Parser(isFalse)];
      const orCombinator = or(...parsers);
      const result = orCombinator(state);
      assert.deepEqual(result, false);
    });
  });
  describe('And', () => {
    test('Passes when all parser passes', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isTrue), Parser(isTrue)];
      const andCombinator = and(...parsers);
      const result = andCombinator(state);
      assert.deepEqual(result, {
        text: 'Hello, World!',
        index: 2,
        results: ['H', 'e'],
        error: '',
      });
    });
    test('Fails when first parser fails', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isFalse), Parser(isTrue)];
      const andCombinator = and(...parsers);
      const result = andCombinator(state);
      assert.deepEqual(result, false);
    });
    test('Fails when no parser passes', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const parsers = [Parser(isFalse), Parser(isFalse)];
      const andCombinator = and(...parsers);
      const result = andCombinator(state);
      assert.deepEqual(result, false);
    });
  });
  describe('Optional', () => {
    test('Passes even if parser fails', () => {
      const state = State('Hello');
      assert.deepEqual(state, {
        text: 'Hello',
        index: 0,
        results: [],
        error: '',
      });
      const result = optional(Parser(isFalse))(state);
      assert.deepEqual(result, {
        text: 'Hello',
        index: 0,
        results: [],
        error: '',
      });
    });
    test('Passes when parser passes', () => {
      const state = State('Hello');
      assert.deepEqual(state, {
        text: 'Hello',
        index: 0,
        results: [],
        error: '',
      });
      const result = optional(Parser(isTrue))(state);
      assert.deepEqual(result, {
        text: 'Hello',
        index: 5,
        results: ['H', 'e', 'l', 'l', 'o'],
        error: '',
      });
    });
  });
  describe('One Zero', () => {
    test('Fails when parser fails', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const result = oneZero(Parser(isFalse))(state);
      assert.deepEqual(result, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
    });
    test('Passes when parser passes (once only)', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const result = oneZero(Parser(isTrue))(state);
      assert.deepEqual(result, {
        text: 'Hello, World!',
        index: 1,
        results: ['H'],
        error: '',
      });
    });
  });
  describe('One Plus', () => {
    test('Fails when parser fails', () => {
      const state = State('Hello, World!');
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
      const result = onePlus(Parser(isFalse))(state);
      assert.ok(!result);
      assert.deepEqual(state, {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: '',
      });
    });
    test('Passes when parser passes (multiple)', () => {
      const state = State('Hello');
      assert.deepEqual(state, {
        text: 'Hello',
        index: 0,
        results: [],
        error: '',
      });
      const result = onePlus(Parser(isTrue))(state);
      assert.deepEqual(result, {
        text: 'Hello',
        index: 5,
        results: ['H', 'e', 'l', 'l', 'o'],
        error: '',
      });
    });
  });
  describe('Consolidate', () => {
    test('Returns state when in error', () => {
      const state = State('Hello, World!');
      state.error = 'Um';

      assert.deepEqual(consolidate((_) => _)(state), {
        text: 'Hello, World!',
        index: 0,
        results: [],
        error: 'Um',
      });
    });
  });
});
