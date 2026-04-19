import {
  Parser,
  ParserWithWhitespace,
  ParserWithoutWhitespace,
  EOI,
  readText,
  prepareInput,
  advance,
  consumeWhitespace,
  reportError,
} from './utils.js';
import {
  or,
  and,
  optional,
  oneZero,
  onePlus,
  consolidate,
  compress,
} from './combinators.js';
import {
  isBooleanTrue,
  isBooleanFalse,
  isNullValue,
  //
  isStringDelim,
  isEscaped,
  isPrintableChar,
  isUnicode,
  //
  isArrayStart,
  isArrayEnd,
  isArraySeparator,
  //
  isObjectStart,
  isObjectEnd,
  isObjectSeparator,
  isObjectKeyValSep,
  //
  isMinusSign,
  isZero,
  isPositiveDigit,
  isSingleDigit,
  isDecimalPoint,
  isExponentSign,
  isArithmeticSigns,
  //
  isSpace,
  isWhitespace,
} from './predicates.js';

// JSON PARSER
const valueParser = or(
  baseParser,
  stringParser,
  numberParser,
  arrayParser,
  objectParser,
);

function baseParser(state) {
  return or(
    Parser(isBooleanTrue, { size: 4 }),
    Parser(isBooleanFalse, { size: 5 }),
    Parser(isNullValue, { size: 4 }),
  )(state);
}

function stringParser(state) {
  return consolidate(
    Parser(isStringDelim),
    optional(
      or(
        ParserWithWhitespace(isUnicode),
        ParserWithWhitespace(isEscaped, { size: 2 }),
        ParserWithWhitespace(isPrintableChar),
      ),
    ),
    reportError('Missing string terminator', Parser(isStringDelim)),
  )(state);
}

function arrayParser(state) {
  return compress(
    Parser(isArrayStart),
    oneZero(
      and(
        valueParser,
        optional(
          and(
            Parser(isArraySeparator),
            reportError('Missing array value', valueParser),
          ),
        ),
      ),
    ),
    reportError('Missing array terminator', Parser(isArrayEnd)),
  )(state);
}

function objectParser(state) {
  return compress(
    Parser(isObjectStart),
    oneZero(
      and(
        keyValuePair,
        optional(
          and(
            Parser(isObjectSeparator),
            reportError('Missing object key-value pair', keyValuePair),
          ),
        ),
      ),
    ),
    reportError('Missing object terminator', Parser(isObjectEnd)),
  )(state);
}
function keyValuePair(state) {
  return and(
    consumeWhitespace,
    stringParser,
    reportError('Missing key-value separator', Parser(isObjectKeyValSep)),
    reportError('Missing property value', valueParser),
  )(state);
}

function numberParser(state) {
  return consolidate(
    integerParser,
    oneZero(fractionParser),
    oneZero(exponentParser),
  )(state);
}
function integerParser(state) {
  return and(
    oneZero(Parser(isMinusSign)),
    or(
      ParserWithoutWhitespace(isZero),
      and(
        ParserWithoutWhitespace(isPositiveDigit),
        optional(ParserWithoutWhitespace(isSingleDigit)),
      ),
    ),
  )(state);
}
function fractionParser(state) {
  return and(
    ParserWithoutWhitespace(isDecimalPoint),
    reportError(
      'Missing fractional digit',
      onePlus(ParserWithoutWhitespace(isSingleDigit)),
    ),
  )(state);
}
function exponentParser(state) {
  return and(
    ParserWithoutWhitespace(isExponentSign),
    oneZero(ParserWithoutWhitespace(isArithmeticSigns)),
    reportError(
      'Missing exponent digit',
      onePlus(ParserWithoutWhitespace(isSingleDigit)),
    ),
  )(state);
}

const jsonParser = (jsonText) => {
  const state = prepareInput(jsonText);
  and(
    reportError('Unexpected lack of input', valueParser),
    reportError('Unexpected end of input', EOI),
  )(state);
  return state.error || state.results?.[0];
};
export default jsonParser;
