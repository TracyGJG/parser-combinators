import { charParser, textParser, endParser } from './json-parser.js';

console.log(charParser('A', 'B')({ data: 'AB', index: 0 }));
console.log(charParser('A', 'B')({ data: 'AC', index: 1 }));
console.log(charParser('A', 'B')({ data: 'AB', index: 1 }));
