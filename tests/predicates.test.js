import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import {
  matchText,
  consumeWhitespace,
  //
  isBooleanTrue,
  isBooleanFalse,
  isNullValue,
  //
  isSpace,
  isLitLinefeed,
  isLitCarriageReturn,
  isLitHorizontalTab,
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
  isStringDelim,
  isPrintableChar,
  isEscaped,
  isUnicode,
} from '../src/predicates.js';

describe('Predicates', () => {
  describe.skip('matchText', () => {
    test('returns true when the string matches as single pattern', () => {
      assert.ok(matchText('Hello')('Hello, World!'));
    });
    test('returns false when the string does not match as single pattern', () => {
      assert.ok(!matchText('World')('Hello, World!'));
    });
    test('returns true when the string matches one of the given patterns', () => {
      assert.ok(matchText('World', 'Hello')('Hello, World!'));
    });
    test('returns false when the string does not match any of the given patterns', () => {
      assert.ok(!matchText('world', 'hello')('Hello, World!'));
    });
    test('returns false when the string is empty', () => {
      assert.ok(!matchText('Hello')(''));
    });
  });

  describe.skip('consumeWhitespace', () => {
    test('does not advances the index for non-whitespace', () => {
      const state = { text: 'Hello, \n\t\rWorld!', index: 5 };
      consumeWhitespace(state);
      assert.deepEqual(state, { text: 'Hello, \n\t\rWorld!', index: 5 });
    });

    test('advances the index ignoring whitespace', () => {
      const state = { text: 'Hello, \n\t\rWorld!', index: 6 };
      consumeWhitespace(state);
      assert.deepEqual(state, { text: 'Hello, \n\t\rWorld!', index: 10 });
    });
  });

  describe.skip('Base Values', () => {
    describe('isBooleanTrue', () => {
      test('returns true for the text "true"', () => {
        assert.ok(isBooleanTrue('true'));
      });
      test('returns false for the text "false"', () => {
        assert.ok(!isBooleanTrue('false'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isBooleanTrue(''));
      });
    });

    describe('isBooleanFalse', () => {
      test('returns true for the text "false"', () => {
        assert.ok(isBooleanFalse('false'));
      });
      test('returns false for the text "true"', () => {
        assert.ok(!isBooleanFalse('true'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isBooleanFalse(''));
      });
    });

    describe('isNullValue', () => {
      test('returns true for the text "null"', () => {
        assert.ok(isNullValue('null'));
      });
      test('returns false for the text "xxx"', () => {
        assert.ok(!isNullValue('xxx'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isNullValue(''));
      });
    });
  });

  describe.skip('Whitespaces', () => {
    describe('isSpace', () => {
      test('returns true for the text " "', () => {
        assert.ok(isSpace(' '));
      });
      test('returns false for the text "x"', () => {
        assert.ok(!isSpace('x'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isSpace(''));
      });
    });

    describe('isLitLinefeed', () => {
      test('returns true for the text "\n"', () => {
        assert.ok(isLitLinefeed('\n'));
      });
      test('returns false for the text "\t"', () => {
        assert.ok(!isLitLinefeed('\t'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isLitLinefeed(''));
      });
    });

    describe('isLitCarriageReturn', () => {
      test('returns true for the text "\r"', () => {
        assert.ok(isLitCarriageReturn('\r'));
      });
      test('returns false for the text "\t"', () => {
        assert.ok(!isLitCarriageReturn('\t'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isLitCarriageReturn(''));
      });
    });

    describe('isLitHorizontalTab', () => {
      test('returns true for the text "\t"', () => {
        assert.ok(isLitHorizontalTab('\t'));
      });
      test('returns false for the text "\n"', () => {
        assert.ok(!isLitHorizontalTab('\n'));
      });
      test('returns false for an empty string', () => {
        assert.ok(!isLitHorizontalTab(''));
      });
    });
  });

  describe.skip('Array', () => {
    describe('isArrayStart', () => {
      test('returns true for the text "["', () => {
        assert.ok(isArrayStart('['));
      });
      test('returns false for the text "]"', () => {
        assert.ok(!isArrayStart(']'));
      });
      test('returns false for the text ","', () => {
        assert.ok(!isArrayStart(','));
      });
    });

    describe('isArrayEnd', () => {
      test('returns true for the text "]"', () => {
        assert.ok(isArrayEnd(']'));
      });
      test('returns true for the text "["', () => {
        assert.ok(!isArrayEnd('['));
      });
      test('returns false for the text "."', () => {
        assert.ok(!isArrayEnd('.'));
      });
    });

    describe('isArraySeparator', () => {
      test('returns true for the text ","', () => {
        assert.ok(isArraySeparator(','));
      });
      test('returns true for the text "["', () => {
        assert.ok(!isArraySeparator('['));
      });
      test('returns false for the text "]"', () => {
        assert.ok(!isArraySeparator(']'));
      });
    });
  });

  describe.skip('Object', () => {
    describe('isObjectStart', () => {
      test('returns true for the text "{"', () => {
        assert.ok(isObjectStart('{'));
      });
      test('returns false for the text "}"', () => {
        assert.ok(!isObjectStart('}'));
      });
      test('returns false for the text ","', () => {
        assert.ok(!isObjectStart(','));
      });
      test('returns false for the text ":"', () => {
        assert.ok(!isObjectStart(':'));
      });
    });

    describe('isObjectEnd', () => {
      test('returns true for the text "}"', () => {
        assert.ok(isObjectEnd('}'));
      });
      test('returns true for the text "{"', () => {
        assert.ok(!isObjectEnd('{'));
      });
      test('returns false for the text ","', () => {
        assert.ok(!isObjectEnd(','));
      });
      test('returns false for the text ":"', () => {
        assert.ok(!isObjectEnd(':'));
      });
    });

    describe('isObjectSeparator', () => {
      test('returns true for the text ","', () => {
        assert.ok(isObjectSeparator(','));
      });
      test('returns true for the text "{"', () => {
        assert.ok(!isObjectSeparator('{'));
      });
      test('returns false for the text "}"', () => {
        assert.ok(!isObjectSeparator('}'));
      });
      test('returns false for the text ":"', () => {
        assert.ok(!isObjectSeparator(':'));
      });
    });

    describe('isObjectKeyValSep', () => {
      test('returns true for the text ":"', () => {
        assert.ok(isObjectKeyValSep(':'));
      });
      test('returns true for the text "["', () => {
        assert.ok(!isObjectKeyValSep('['));
      });
      test('returns false for the text "]"', () => {
        assert.ok(!isObjectKeyValSep(']'));
      });
      test('returns false for the text ","', () => {
        assert.ok(!isObjectKeyValSep(','));
      });
    });
  });

  describe.skip('Number', () => {
    describe('Integer', () => {
      describe('isMinusSign', () => {
        test('returns true for the text "-"', () => {
          assert.ok(isMinusSign('-'));
        });
        test('returns true for the text "+"', () => {
          assert.ok(!isMinusSign('+'));
        });
      });

      describe('isZero', () => {
        test('returns true for the text "0"', () => {
          assert.ok(isZero('0'));
        });
        test('returns true for the text "."', () => {
          assert.ok(!isZero('.'));
        });
      });

      describe('isPositiveDigit', () => {
        test('returns true for the text "1"', () => {
          assert.ok(isPositiveDigit('1'));
        });
        test('returns true for the text "9"', () => {
          assert.ok(isPositiveDigit('9'));
        });
        test('returns true for the text "0"', () => {
          assert.ok(!isPositiveDigit('0'));
        });
      });

      describe('isSingleDigit', () => {
        test('returns true for the text "0"', () => {
          assert.ok(isSingleDigit('0'));
        });
        test('returns true for the text "9"', () => {
          assert.ok(isSingleDigit('9'));
        });
        test('returns true for the text "."', () => {
          assert.ok(!isSingleDigit('.'));
        });
      });
    });

    describe('Fraction', () => {
      describe('isDecimalPoint', () => {
        test('returns true for the text "."', () => {
          assert.ok(isDecimalPoint('.'));
        });
        test('returns false for the text ","', () => {
          assert.ok(!isDecimalPoint(','));
        });
      });
    });

    describe('Exponent', () => {
      describe('isExponentSign', () => {
        test('returns true for the text "e"', () => {
          assert.ok(isExponentSign('e'));
        });
        test('returns true for the text "E"', () => {
          assert.ok(isExponentSign('E'));
        });
        test('returns false for the text "."', () => {
          assert.ok(!isExponentSign('.'));
        });
      });

      describe('isArithmeticSigns', () => {
        test('returns true for the text "+"', () => {
          assert.ok(isArithmeticSigns('+'));
        });
        test('returns true for the text "-"', () => {
          assert.ok(isArithmeticSigns('-'));
        });
        test('returns false for the text ","', () => {
          assert.ok(!isArithmeticSigns(','));
        });
      });
    });
  });

  describe('String', () => {
    describe.skip('isStringDelim', () => {
      test(`returns true for the text '"'`, () => {
        assert.ok(isStringDelim('"'));
      });
      test(`returns false for the text "'"`, () => {
        assert.ok(!isStringDelim("'"));
      });
    });

    describe('isPrintableChar', () => {
      test(`returns true for the text 'A'`, () => {
        assert.ok(isPrintableChar('A'));
      });
      test(`returns true for the text ' '`, () => {
        assert.ok(isPrintableChar(' '));
      });
      test(`returns false for a control character`, () => {
        assert.ok(!isPrintableChar('\t'));
      });
      test(`returns false for a double-quotation mark`, () => {
        assert.ok(!isPrintableChar('"'));
      });
      test(`returns false for an escape prefix`, () => {
        assert.ok(!isPrintableChar('\\'));
      });
    });

    describe.skip('isEscaped', () => {
      test(`returns true for the text '\\"'`, () => {
        assert.ok(isEscaped('\\"'));
      });
      test(`returns true for the text '\\'`, () => {
        assert.ok(isEscaped('\\'));
      });
      test(`returns true for the text "\/"`, () => {
        assert.ok(isEscaped('\/'));
      });
      test(`returns true for the text "\\b"`, () => {
        assert.ok(isEscaped('\\b'));
      });
      test(`returns true for the text "\\f"`, () => {
        assert.ok(isEscaped('\\f'));
      });
      test(`returns true for the text "\\n"`, () => {
        assert.ok(isEscaped('\\n'));
      });
      test(`returns true for the text "\\r"`, () => {
        assert.ok(isEscaped('\\r'));
      });
      test(`returns true for the text "\\t"`, () => {
        assert.ok(isEscaped('\\t'));
      });
      test(`returns false for the text "\\a"`, () => {
        assert.ok(!isEscaped('\\a'));
      });
      test(`returns false for the text "a"`, () => {
        assert.ok(!isEscaped('a'));
      });
    });

    describe.skip('isUnicode', () => {
      test(`returns true for the text "\\uABCD"`, () => {
        assert.ok(isUnicode('\\uABCD'));
      });
      test(`returns true for the text "\\uABCDE"`, () => {
        assert.ok(isUnicode('\\uABCDE'));
      });
      test(`returns false for the text "\\uABCG"`, () => {
        assert.ok(!isUnicode('\\uABCG'));
      });
      test(`returns false for the text "\\uABC"`, () => {
        assert.ok(!isUnicode('\\uABC'));
      });
      test(`returns false for the text '\\u'`, () => {
        assert.ok(!isUnicode('\\u'));
      });
      test(`returns false for the text '\\t'`, () => {
        assert.ok(!isUnicode('\\t'));
      });
      test(`returns false for the text 't'`, () => {
        assert.ok(!isUnicode('t'));
      });
    });
  });
});
