import { parse, endOfText } from './utils.js';
import * as predicates from './predicates.js';
import * as parsers from './parsers.js';

function parseJson(state) {
  parsers.isValue(state);
  return {
    ...state,
    error: endOfText(state) ? '' : 'Error: Incomplete processing of input.',
  };
}

{
  console.groupCollapsed('\nPredicates');
  const tests = {
    isSpace: ['', '_', ' ', '  ', ' _'],
    isLitLinefeed: ['', '_', '\n'],
    isLitCarriageReturn: ['', '_', '\r'],
    isLitHorizontalTab: ['', '_', '\t'],
    isStringDelim: ['', '_', '"'],
    isQuotationMark: ['', '\\_', '\\"'],
    isReversSolidus: ['', '\\_', '\\\\'],
    isSolidus: ['', '\\_', '\\/'],
    isBackspace: ['', '\\_', '\\b'],
    isFormfeed: ['', '\\_', '\\f'],
    isEscLinefeed: ['', '\\_', '\\n'],
    isEscCarriageReturn: ['', '\\_', '\\r'],
    isEscHorizontalTab: ['', '\\_', '\\t'],
    isEscEncodedUnicode: [
      '',
      '\\_',
      '\\u',
      '\\u123',
      '\\u123_',
      '\\u1234',
      '\\u12345',
      '\\uabcd',
      '\\uABCD',
    ],
    isBooleanTrue: ['false', 'True', 'true'],
    isBooleanFalse: ['true', 'False', 'false'],
    isNullValue: ['', 'NULL', 'null'],
  };
  for (let test in tests) {
    console.log(`\n${test}`);
    for (let testcase of tests[test])
      console.log(`\t'${testcase}': ${predicates[test](testcase)}`);
  }
}
{
  console.log('\nisBooleanFalse');
  const state = {
    index: 0,
    text: 'truefalsetrue',
  };
  console.log(parse(predicates.isBooleanFalse, 5)(state));
  state.index = 4;
  console.log(parse(predicates.isBooleanFalse, 5)(state));
  console.log(parse(predicates.isBooleanFalse, 5)(state));
}
{
  console.log('\nisBooleanTrue');
  const state = {
    index: 0,
    text: 'truefalsetrue',
  };
  console.log(parse(predicates.isBooleanTrue, 4)(state));
  console.log(parse(predicates.isBooleanTrue, 4)(state));
  state.index = 9;
  console.log(parse(predicates.isBooleanTrue, 4)(state));
}
{
  console.log('\nisNullValue');
  const state = {
    index: 1,
    text: '[null, false, null]',
  };
  console.log(parse(predicates.isNullValue, 4)(state));
  console.log(parse(predicates.isNullValue, 4)(state));
  state.index = 14;
  console.log(parse(predicates.isNullValue, 4)(state));
  console.groupEnd();
}

{
  console.groupCollapsed('\nParsers');
  console.log('\nisWhitespace');
  console.log(
    parsers.isWhitespace({
      index: 0,
      text: ' \t\n\r_ \t\n\r',
    }),
  );
  console.log(
    parsers.isWhitespace({
      index: 5,
      text: ' \t\n\r_ \t\n\r',
    }),
  );
}
{
  console.log('\nisValue');

  //
  console.log(
    parseJson({
      index: 0,
      text: '  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  true  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  true  null',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  "  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  ""  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  """  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  []  ',
    }),
  );
  //
  console.log(
    parseJson({
      index: 0,
      text: '  {}  ',
    }),
  );
}
{
  // console.log('\nBlocks');
  // console.log('\tString');
  // let state = {
  //   index: 0,
  //   text: '""',
  // };
  // parsers.isString(state);
  // console.log(state);
  // console.log('\tArray');
  // state = {
  //   index: 0,
  //   text: '[]',
  // };
  // parsers.isArray(state);
  // console.log(state);
  // console.log('\tObject');
  // state = {
  //   index: 0,
  //   text: '{}',
  // };
  // parsers.isObject(state);
  // console.log(state);
}
{
  // console.log('\nisPrintableChar');
  // const tests = ['"', '\\', '\t', '\u007F', '\u007E', 'A'];
  // tests.forEach((test) => console.log(test, parsers.isPrintableChar(test)));
}

{
  // const tests = {
  //   // isExponent: ['', 'e', 'E', 'E+12'],
  // };
  // for (let test in tests) {
  //   console.log(`\n${test}`);
  //   for (let testcase of tests[test])
  //     console.log(`\t'${testcase}': ${parsers[test](testcase)}`);
  // }
}

{
  // const state = { text: 'AB', index: 0, error: null };
  // const predicate = (_state) => _state[0] === 'A';
  // const aParser = parse(predicate);
  // const requiredParser = parsers.Required(aParser, 'Missing value');
  // console.log(requiredParser(state));
  // console.log(requiredParser(state));
}

{
  // const state = { text: 'AAAAB', index: 0, error: null };
  // const predicateA = (_state) => _state[0] === 'A';
  // const parserA = parse(predicateA);
  // const predicateB = (_state) => _state[0] === 'B';
  // const parserB = parse(predicateB);
  // {
  //   console.log(`\nRepeat(A), min:0, max:Infinity`);
  //   const repeatParser = parsers.Repeat(parserA);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
  // {
  //   console.log(`\nRepeat(A), min:0, max:2`);
  //   state.index = 0;
  //   const repeatParser = parsers.Repeat(parserA, 1, 2);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
  // {
  //   console.log(`\nRepeat(A), min:1, max:4`);
  //   state.index = 0;
  //   const repeatParser = parsers.Repeat(parserA, 1, 4);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
  // {
  //   console.log(`\nRepeat(A), min:1, max:5`);
  //   state.index = 0;
  //   const repeatParser = parsers.Repeat(parserA, 1, 5);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
  // {
  //   console.log(`\nRepeat(B), min:0, max:Infinity`);
  //   state.index = 0;
  //   const repeatParser = parsers.Repeat(parserB);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
  // {
  //   console.log(`\nRepeat(B), min:1, max:Infinity`);
  //   state.index = 0;
  //   const repeatParser = parsers.Repeat(parserB, 1);
  //   console.log(repeatParser(state));
  //   console.log(state);
  // }
}
console.groupEnd();
