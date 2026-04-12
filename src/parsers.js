import {
  // Base
  isBooleanTrue,
  isBooleanFalse,
  isNullValue,
  // Array
  isArrayStart,
  isArrayEnd,
  isArraySeparator,
  // Object
  isObjectStart,
  isObjectEnd,
  isObjectSeparator,
  isObjectKeyValSep,
  // Number
  isMinusSign,
  isZero,
  isPositiveDigit,
  isSingleDigit,
  isDecimalPoint,
  isExponentSign,
  isArithmeticSigns,
  // String
  isStringDelim,
  isPrintableChar,
  isEscaped,
  isUnicode,
} from './predicates.js';

import { sequence, preference, occurance } from './combinators.js';
import { parser } from './utils.js';

export function value(state) {
  return preference(array, object, string, base, number)(state);
}

export function array(state) {
  const additionalValues = occurance(sequence(parser(isArraySeparator), value));
  return sequence(
    parser(isArrayStart),
    occurance(sequence(value, additionalValues), {
      max: 1,
    }),
    parser(isArrayEnd),
  )(state);
}

export function object(state) {
  const keyValuePair = [string, parser(isObjectKeyValSep), value];
  const additionalKeyValues = occurance(
    sequence(parser(isObjectSeparator), ...keyValuePair),
  );
  return sequence(
    parser(isObjectStart),
    occurance(sequence(...keyValuePair, additionalKeyValues), {
      max: 1,
    }),
    parser(isObjectEnd),
  )(state);
}

export function number(state) {
  return sequence(
    integer,
    occurance(fraction, { max: 1 }),
    occurance(exponent, { max: 1 }),
  )(state);
}
function integer(state) {
  return sequence(
    occurance(parser(isMinusSign), { max: 1 }),
    preference(
      occurance(parser(isZero), { min: 1 }),
      preference(
        occurance(parser(isPositiveDigit), { min: 1 }),
        occurance(parser(isSingleDigit)),
      ),
    ),
  )(state);
}
function fraction(state) {
  return sequence(
    parser(isDecimalPoint),
    occurance(parser(isSingleDigit), { min: 1 }),
  )(state);
}
function exponent(state) {
  return sequence(
    parser(isExponentSign),
    occurance(parser(isArithmeticSigns), { max: 1 }),
    occurance(parser(isSingleDigit), { min: 1 }),
  )(state);
}

export function string(state) {
  return sequence(
    parser(isStringDelim),
    occurance(
      preference(
        parser(isEscaped, { size: 2, stripWhitespace: false }),
        parser(isPrintableChar, { stripWhitespace: false }),
        parser(isUnicode, { size: 6, stripWhitespace: false }),
      ),
    ),
    parser(isStringDelim),
  )(state);
}
export function base(state) {
  return preference(
    parser(isBooleanTrue, { size: 4 }),
    parser(isBooleanFalse, { size: 5 }),
    parser(isNullValue, { size: 4 }),
  )(state);
}
