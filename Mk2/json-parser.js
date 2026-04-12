import { Parser } from './utils.js';

import {
  isArrayStart,
  isArrayEnd,
  isValueSeparater,
  isNegative,
  isZero,
  isLeadingDigit,
  isDigit,
  isDecimalPoint,
  isExponentChar,
  isSignChar,
  isObjectStart,
  isObjectEnd,
  isKeySeparater,
  isStringDelim,
  isPrintableChar,
  isEscapeChar,
  isUnicodeChar,
  isTrue,
  isFalse,
  isNull,
  isWhitespaceChar,
} from './predicates.js';

import { CHOICE, SEQUENCE, MULTIPLE, REQUIRED } from './combinators.js';

let parseLiteral;
let parseWhiteSpace;
let parseNumber;
let parseString;
let parseArray;

//
const parseValue = SEQUENCE(
  '',
  parseWhiteSpace,
  CHOICE('Bad String', parseString),
  parseWhiteSpace
);
//
//

parseWhiteSpace = MULTIPLE(
  //
  Parser(
    //
    isWhitespaceChar //
  ) //
);
//

parseArray = SEQUENCE(
  'Invalid start of Array',
  Parser(isArrayStart),
  // CHOICE(
  parseWhiteSpace,
  //   SEQUENCE(
  //     REQUIRED(parseString, 'Invalid value'),
  //     MULTIPLE(
  //       SEQUENCE(
  //         //
  //         REQUIRED(
  //           //
  //           Parser(isValueSeparater, 'Invalid separator')
  //         ), //
  //         REQUIRED(parseString, 'Invalid value') //
  //       )
  //     )
  //   )
  // ),
  REQUIRED(Parser(isArrayEnd), 'Invalid end of Array')
);

parseString = SEQUENCE(
  '',
  REQUIRED(Parser(isStringDelim)),
  MULTIPLE(
    Parser(isPrintableChar),
    Parser(isEscapeChar, 2),
    Parser(isUnicodeChar, 6)
  ),
  REQUIRED(Parser(isStringDelim))
);

const parseInteger = SEQUENCE(
  '',
  Parser(isNegative),
  CHOICE(
    'Invalid number (integer)',
    Parser(isLeadingDigit),
    SEQUENCE(
      REQUIRED(Parser(isLeadingDigit)), //
      MULTIPLE(Parser(isDigit)) //
    )
  )
);

const parseFraction = SEQUENCE(
  '',
  REQUIRED(Parser(isDecimalPoint)),
  REQUIRED(Parser(isDigit)),
  MULTIPLE(Parser(isDigit))
);

const parseExponent = SEQUENCE(
  '',
  REQUIRED(Parser(isExponentChar)),
  Parser(isSignChar),
  REQUIRED(Parser(isDigit)),
  MULTIPLE(Parser(isDigit))
);

parseNumber = SEQUENCE(
  'Invalid Number',
  //
  REQUIRED(parseInteger), //
  parseFraction, //
  parseExponent //
);
//

parseLiteral = CHOICE(
  'Invalid literal',
  //
  Parser(isTrue, 4),
  Parser(isFalse, 5),
  Parser(isNull, 4)
);

const parseJson = (jsonString) => {
  const state = { input: jsonString, error: null, index: 0 };

  return parseArray(state);
};

export default parseJson;
