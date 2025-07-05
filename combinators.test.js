import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  parseExponent,
  parseFraction,
  parseInteger,
  // parseWhitespace,
} from './combinators.js';

describe('combinators', () => {
  describe('parseInteger', () => {
    it('can pass at the end of the input', () => {
      const state = { data: '', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 0);
    });
    it('can process unsigned zero', () => {
      const state = { data: '0_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 1);
    });
    it('can process negative zero', () => {
      const state = { data: '-0_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 2);
    });
    it('can process unsigned single digit', () => {
      const state = { data: '1_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 1);
    });
    it('can process negative single digit', () => {
      const state = { data: '-2_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 2);
    });
    it('can process unsigned multi-digit', () => {
      const state = { data: '10_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 2);
    });
    it('can process negative multi-digit', () => {
      const state = { data: '-20_', index: 0, error: '' };
      const { index } = parseInteger(state);
      assert.equal(index, 3);
    });
  });

  describe('parseExponent', () => {
    it('can pass at the end of the input', () => {
      const state = { data: '', index: 0, error: '' };
      const { index } = parseExponent(state);
      assert.equal(index, 0);
    });
    it('can process a positive exponent', () => {
      const state = { data: 'e+012_', index: 0, error: '' };
      const { index } = parseExponent(state);
      assert.equal(index, 5);
    });
    it('can process a negative exponent', () => {
      const state = { data: 'E-012_', index: 0, error: '' };
      const { index } = parseExponent(state);
      assert.equal(index, 5);
    });
    it('can process an unsigned exponent', () => {
      const state = { data: 'e012_', index: 0, error: '' };
      const { index } = parseExponent(state);
      assert.equal(index, 4);
    });
    it('can process an exponent without e|E', () => {
      const state = { data: '12_', index: 0, error: '' };
      const { index, error } = parseExponent(state);
      assert.equal(index, 0);
      assert.equal(error, '');
    });
    it('can process an exponent with unexpected symbol', () => {
      const state = { data: 'e_12_', index: 0, error: '' };
      const { error } = parseExponent(state);
      assert.equal(error, 'Error at 1: Invalid exponent');
    });
  });

  describe('parseFraction', () => {
    it('can pass at the end of the input', () => {
      const state = { data: '', index: 0, error: '' };
      const { index } = parseFraction(state);
      assert.equal(index, 0);
    });
    it('can process a fractional', () => {
      const state = { data: '.012_', index: 0, error: '' };
      const { index } = parseFraction(state);
      assert.equal(index, 4);
    });
    it('can pass a fractional without a decimal point (bad symbol)', () => {
      const state = { data: '_012_', index: 0, error: '' };
      const { index, error } = parseFraction(state);
      assert.equal(index, 0);
      assert.equal(error, '');
    });
    it('can pass a fractional without a decimal point (no point)', () => {
      const state = { data: '012_', index: 0, error: '' };
      const { index, error } = parseFraction(state);
      assert.equal(index, 0);
      assert.equal(error, '');
    });
  });

  // describe('parseWhitespace', () => {
  //   it('can pass at the end of the input', () => {
  //     const state = { data: '', index: 0, error: '' };
  //     const { index } = parseWhitespace(state);
  //     assert.equal(index, 0);
  //   });
  //   it('can process leading whitespace', () => {
  //     const state = { data: ' \n\r\t_', index: 0, error: '' };
  //     const { index } = parseWhitespace(state);
  //     assert.equal(index, 4);
  //   });
  //   it('can process trailing whitespace', () => {
  //     const state = { data: '_ \n\r\t', index: 1, error: '' };
  //     const { index } = parseWhitespace(state);
  //     assert.equal(index, 5);
  //   });
  //   it('can pass whitespace post non-whitespace', () => {
  //     const state = { data: '_ \n\r\t', index: 0, error: '' };
  //     const { index } = parseWhitespace(state);
  //     assert.equal(index, 0);
  //   });
  // });
});
