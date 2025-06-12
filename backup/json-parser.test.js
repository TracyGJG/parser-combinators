import { describe, it } from 'node:test';
import assert from 'node:assert';

import Package from './package.json' with { type: 'json' };

import JsonParser from './json-parser.js';

describe('JSON PARSER', () => {
  const testData = JSON.stringify(Package);

  it('can process a JSON string', () => {
    assert.ok(testData);

    const result = JsonParser(testData);
    assert.ok(result);
    assert.ok(result.error);
    assert.ok(result.tokens);
    
  });
});
