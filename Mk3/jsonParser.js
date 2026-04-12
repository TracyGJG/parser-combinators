// ['', '    ', '   true  '].forEach((testcase) =>
//   console.log(jsonParser(testcase)),
// );

function jsonParser(jsonText) {
  const state = {
    index: 0,
    text: jsonText,
    tokens: [],
    error: null,
  };

  return state;
}

function matchText(...matches) {
  return (text = '') => matches.includes(text);
}

const isWhitespace = matchText(' ', '\n', '\r', '\t');
['_', ' ', '\t', '\n', '\r'].forEach((testcase) =>
  console.log(
    `isWhitespace('${testcase}') [${testcase.codePointAt(0)}] = ${isWhitespace(testcase)}`,
  ),
);
console.log('\n');

const isBoolean = matchText('true', 'false');
const isNull = matchText('null');
const isLiteralValue = (_) => isBoolean(_) || isNull(_);
['', ' ', 'test', 'true', 'false', 'null'].forEach((testcase) =>
  console.log(`isLiteralValue('${testcase}') = ${isLiteralValue(testcase)}`),
);
console.log('\n');

const isExpChar = matchText(...'eE');
['_', 'e', 'E'].forEach((testcase) =>
  console.log(`isExpChar('${testcase}') = ${isExpChar(testcase)}`),
);
console.log('\n');

const isZero = matchText('0');
const isPostive = matchText(...'123456789');
const isDigit = (_) => isZero(_) || isPostive(_);
['+', '0', '9'].forEach((testcase) =>
  console.log(`isDigit('${testcase}') = ${isDigit(testcase)}`),
);
console.log('\n');

const isNegative = matchText('-');
['+', '-'].forEach((testcase) =>
  console.log(`isNegative('${testcase}') = ${isNegative(testcase)}`),
);
console.log('\n');

const isSign = matchText(...'+-');
['.', '+', '-'].forEach((testcase) =>
  console.log(`isSign('${testcase}') = ${isSign(testcase)}`),
);
console.log('\n');

const isPoint = matchText('.');
['_', '.'].forEach((testcase) =>
  console.log(`isPoint('${testcase}') = ${isPoint(testcase)}`),
);
console.log('\n');
