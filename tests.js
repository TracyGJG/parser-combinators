import {
  isChars,
  isEscapeChar,
  isUnicodeChar,
  isWhitespace,
  isString,
  isHexadecimal,
  isValidStringChar,
  parseWhitespace,
} from './json-parser.js';

{
  console.log('\nisChars');
  console.assert(isChars('abc')({ data: 'abc', index: 0 }), 'isChars mismatch');
  console.assert(isChars('abc')({ data: 'abc', index: 1 }), 'isChars mismatch');
  console.assert(isChars('abc')({ data: 'abc', index: 2 }), 'isChars mismatch');
  console.assert(
    isChars('abc')({ data: 'abcd', index: 3 }),
    'isChars mismatch'
  );
  console.assert(
    isChars('abc', true)({ data: 'abcd', index: 3 }),
    'isChars mismatch'
  );
  console.assert(
    isChars('abc', true)({ data: 'abcd', index: 2 }),
    'isChars mismatch'
  );
}

{
  const data = ' y\\b\\n\\r\\t\\x';
  console.log(`\nisWhitespace: "${data}" (${data.length})`);
  console.assert(isWhitespace({ data, index: 0 }));
  console.assert(
    isWhitespace({ data, index: 1 }),
    'isWhitespace: Bad char at 1'
  );
  console.assert(isWhitespace({ data, index: 2 }));
  console.assert(isWhitespace({ data, index: 4 }));
  console.assert(isWhitespace({ data, index: 6 }));
  console.assert(isWhitespace({ data, index: 8 }));
  console.assert(
    isWhitespace({ data, index: 10 }),
    'isWhitespace: Bad char at 10'
  );
}

{
  console.log('\nisString');
  const data = 'Hello, World!';
  console.assert(isString('Hello')({ data, index: 0 }));
  console.assert(
    isString('Hello')({ data, index: 1 }),
    'isString: Misalignment'
  );
  console.assert(isString('Hello', false)({ data, index: 0 }));
  console.assert(isString('hello', false)({ data, index: 0 }));
  console.assert(
    isString('hello')({ data, index: 0 }),
    'isString: Case mismatch'
  );
}

{
  const data = '"\b\n\r\tx';
  console.log(`\nisEscapeChar: "${data}" (${data.length})`);

  console.assert(isEscapeChar({ data, index: 0 }));
  console.assert(isEscapeChar({ data, index: 1 }));
  console.assert(isEscapeChar({ data, index: 2 }));
  console.assert(isEscapeChar({ data, index: 3 }));
  console.assert(isEscapeChar({ data, index: 4 }));
  console.assert(isEscapeChar({ data, index: 5 }), 'isEscapeChar: invalid');
}

{
  console.log('\nisHexadecimal');
  console.assert(isHexadecimal('0'));
  console.assert(isHexadecimal('A'));
  console.assert(isHexadecimal('a'));
  console.assert(isHexadecimal('abcd'));
  console.assert(isHexadecimal('x'), 'isHexadecimal: Invalid');
}

{
  const data = '"\\\t T';
  console.log(`
isValidStringChar: "${data}" (${data.length})`);

  console.assert(
    isValidStringChar({ data, index: 0 }),
    'isValidStringChar: Found double-quote'
  );
  console.assert(
    isValidStringChar({ data, index: 1 }),
    'isValidStringChar: Found back-slash'
  );
  console.assert(
    isValidStringChar({ data, index: 2 }),
    'isValidStringChar: Found tab'
  );
  console.assert(isValidStringChar({ data, index: 3 }));
  console.assert(isValidStringChar({ data, index: 4 }));
}

{
  {
    const state = { data: '    ', index: 0 };
    console.log(`
parseWhitespace: '${state.data}' (${state.data.length})`);

    console.log(parseWhitespace(state));
  }
  {
    const state = {
      data: '\t\t \n',
      index: 0,
    };
    console.log(`
parseWhitespace: '${state.data}' (${state.data.length})`);

    console.log(parseWhitespace(state));
  }
}

{
  const data = ' abcd \\uabc \\uabcd';
  console.log(`
isUnicodeChar: "${data}" (${data.length})`);

  console.assert(
    isUnicodeChar({ data, index: 0 }),
    'isUnicodeChar: Invalid code'
  );
  console.assert(
    isUnicodeChar({ data, index: 1 }),
    'isUnicodeChar: Invalid code'
  );
  console.assert(
    isUnicodeChar({ data, index: 6 }),
    'isUnicodeChar: Invalid code'
  );
  console.assert(isUnicodeChar({ data, index: 12 }));
}
