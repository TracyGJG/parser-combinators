import fs from 'fs';
import path from 'path';
import manifest from './manifest.json' with {"type": "json"};

import jsonParser from './json-parser.js';

console.clear();

console.group('Valid JSON');
manifest.valid.forEach(filename => {
    console.log(jsonParser(fs.readFileSync(path.join(process.cwd(), 'testData', `${filename}.json`), 'utf-8')));
});
console.groupEnd('Valid JSON');

console.group('Invalid JSON');
manifest.invalid.forEach(([filename, reason]) => {
    const state = jsonParser(fs.readFileSync(path.join(process.cwd(), 'testData', `${filename}.json`), 'utf-8'));
    console.log(`${state.error === reason}: ${state.error}`)
});
console.groupEnd('Invalid JSON');
