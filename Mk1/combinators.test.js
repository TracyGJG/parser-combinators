import { describe, it } from 'node:test';
import assert from 'node:assert';

import { Choice, Optional, Repeat, Sequence } from './combinators.js';

describe('Combinators', () => {
  // describe('Choice', () => {});

  describe('Optional', () => {
    it('can accept a valid parser', () => {
      const state = { data: { index: 1, error: '' }, index: 0, error: '' };
      const parser = ({ data }) => ({
        data: '',
        error: data.error,
        index: data.index,
      });
      const result = Optional(parser)(state);
      assert.equal(result.index, 1);
      assert.equal(result.error, '');
    });
    it('can accept an invalid parser', () => {
      const state = { data: { index: 1, error: '_' }, index: 0, error: '' };
      const parser = ({ data }) => ({
        data: '',
        error: data.error,
        index: data.index,
      });
      const result = Optional(parser)(state);
      assert.equal(result.index, 1);
      assert.equal(result.error, '');
    });
  });

  // describe('Repeat', () => {});

  // describe('Sequence', () => {});
});
