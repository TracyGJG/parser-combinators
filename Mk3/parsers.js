import { nextText, parse, endOfText, Required, Repeat } from './utils.js';
import {
  isSpace,
  isLitLinefeed,
  isLitCarriageReturn,
  isLitHorizontalTab,
  isBooleanTrue,
  isBooleanFalse,
  isNullValue,
  isArrayStart,
  isArrayEnd,
  isObjectStart,
  isObjectEnd,
  isStringDelim,
} from './predicates.js';

export function isWhitespace(state) {
  let _isWhitespace = true;
  while (!endOfText(state) && _isWhitespace) {
    _isWhitespace = [
      isSpace,
      isLitLinefeed,
      isLitCarriageReturn,
      isLitHorizontalTab,
    ].some((predicate) => predicate(nextText(state)));
    state.index += 1 * _isWhitespace;
  }
  return state;
}

export function isValue(state) {
  isWhitespace(state);

  isObject(state);
  isString(state);
  isWhitespace(state);
  return state;

  // const index = state.index;
  // const result = [
  //   // parse(isBooleanTrue, 4),
  //   // parse(isBooleanFalse, 5),
  //   // parse(isNullValue, 4),
  //   // isArray,
  //   isObject,
  //   isString,
  // ].some((parser) => {
  //   return parser(state).index > index;
  // });

  // return result ? isWhitespace(state) : { ...state, isMatched: false };
}

export function isArray(state) {
  if (parse(isArrayStart)(state)) {
    return parse(isArrayEnd)(state);
  }
  return false;
}

export function isObject(state) {
  if (parse(isObjectStart)(state)) {
    return parse(isObjectEnd)(state);
  }
  return false;
}

export function isString(state) {
  if (parse(isStringDelim)(state)) {
    // Repeat 0+
    //  Any
    //    parse(isPrintableChar)
    //    parse(isQuotationMark, 2)
    //    parse(isReversSolidus, 2)
    //    parse(isSolidus, 2)
    //    parse(isBackspace, 2)
    //    parse(isFormfeed, 2)
    //    parse(isEscLinefeed, 2)
    //    parse(isEscCarriageReturn, 2)
    //    parse(isEscHorizontalTab, 2)
    //    parse(isEscEncodedUnicode, 6)
    return parse(isStringDelim)(state);
  }
  return false;
}

export function isNumber(state) {
  // const index = state.index;
  // isInteger(state);
  // if (state.index > index) {
  //   isFraction(state);
  //   isExponent(state);
  // }
  return { ...state, isMatched: true };
}

function isInteger(state) {
  // isMinusSign (O)
  // Either
  //  isZero
  // or
  //  isPositiveDigit (R)
  //  Repeat 0+, isSingleDigit
  return state;
}

function isFraction() {
  // isDecimalPoint (R)
  // Repeat 1+, isSingleDigit
  return state;
}

export function isExponent(state) {
  //   if (Required(parse(isExponentSign))(state)) {
  //     parse(isSigns)(state);
  //     // Repeat 1+, isSingleDigit
  //   }
  return state;
}

/*
isValue
  isWhitespace*
  anyOne (1)
    isArray
    isString
    isObject
    isNumber
    isBooleanTrue
    isBooleanFalse
    isNullValue
  isWhitespace*
  
isWhitespace
  many (0..*)
    isSpace
    isLitLinefeed
    isLitCarriageReturn
    isLitHorizontalTab


isArray
isString
isObject

isNumber
  isInteger
  any (0,1)
    isFraction
  any (0,1)
    isExponent

*/
