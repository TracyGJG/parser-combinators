import { describe, it } from 'node:test';
import assert from 'node:assert';

import {
  isAlphanumeric,
  isChars,
  isDigit_0_9,
  isDigit_1_9,
  isEscapeChar,
  isHexadecimal,
  isNonPrintable,
  isUnicodeChar,
  isWhitespace,
} from './predicates.js';

describe('Predicates', () => {
  describe('isAlphanumeric', () => {
    it('can validate a digit', () => {
      assert.equal(isAlphanumeric('0'), true);
    });
    it('can validate a lower case letter', () => {
      assert.equal(isAlphanumeric('a'), true);
    });
    it('can validate an upper case letter', () => {
      assert.equal(isAlphanumeric('A'), true);
    });
    it('can invalidate a non-alphanumeric character', () => {
      assert.equal(isAlphanumeric('@'), false);
    });
  });

  describe('isChars', () => {
    it('can validate the first character in a string', () => {
      assert.equal(isChars('ab')('b'), true);
    });
    it('can validate the nth character in a string', () => {
      assert.equal(isChars('ab')('b'), true);
    });
    it('can invalidate any character not in the string', () => {
      assert.equal(isChars('ab')('c'), false);
    });
  });

  describe('isDigit_0_9', () => {
    it('can validate zero the minimum digit', () => {
      assert.equal(isDigit_0_9('0'), true);
    });
    it('can validate nine the maximum digit', () => {
      assert.equal(isDigit_0_9('9'), true);
    });
    it('can invalidate @ as a digit', () => {
      assert.equal(isDigit_0_9('@'), false);
    });
  });

  describe('isDigit_1_9', () => {
    it('can validate one the minimum digit', () => {
      assert.equal(isDigit_1_9('1'), true);
    });
    it('can validate nine the maximum digit', () => {
      assert.equal(isDigit_1_9('9'), true);
    });
    it('can invalidate zero the minimum digit', () => {
      assert.equal(isDigit_1_9('0'), false);
    });
    it('can invalidate @ as a digit', () => {
      assert.equal(isDigit_1_9('@'), false);
    });
  });

  describe('isEscapeChar', () => {
    it('can validate a double quote character as an escaped character', () => {
      assert.equal(isEscapeChar('"'), true);
    });
    it('can validate a reverse solidus character as an escaped character', () => {
      assert.equal(isEscapeChar('/'), true);
    });
    it('can validate a reverse solidus character as an escaped character', () => {
      assert.equal(isEscapeChar('\\'), true);
    });
    it('can validate a backspace an escaped character', () => {
      assert.equal(isEscapeChar('\b'), true);
    });
    it('can validate a form feed an escaped character', () => {
      assert.equal(isEscapeChar('\f'), true);
    });
    it('can validate a newlinw an escaped character', () => {
      assert.equal(isEscapeChar('\n'), true);
    });
    it('can validate a carriage-returnas an escaped character', () => {
      assert.equal(isEscapeChar('\r'), true);
    });
    it('can validate a horizontal tab as an escaped character', () => {
      assert.equal(isEscapeChar('\t'), true);
    });
  });

  describe('isHexadecimal', () => {
    it('can validate a digit as a hexadecimal character', () => {
      assert.equal(isHexadecimal('0'), true);
    });
    it('can validate a lowercase alphabetic (a-f) as a hexadecimal character', () => {
      assert.equal(isHexadecimal('a'), true);
    });
    it('can validate an uppercase alphabetic (A-F) as a hexadecimal character', () => {
      assert.equal(isHexadecimal('F'), true);
    });
    it('can invalidate an alphabetic outside of a-f as a hexadecimal character', () => {
      assert.equal(isHexadecimal('g'), false);
    });
  });

  describe('isNonPrintable', () => {
    it('can invalidate a letter as non-printable', () => {
      assert.equal(isNonPrintable('b'), false);
    });
    it('can validate backspace as non-printable', () => {
      assert.equal(isNonPrintable('\b'), true);
    });
  });

  describe('isUnicodeChar', () => {
    it('can validate a unicode character with digits', () => {
      assert.equal(isUnicodeChar('u0123'), true);
    });
    it('can validate a as an escaped character', () => {
      assert.equal(isUnicodeChar('uabcd'), true);
    });
    it('can validate a unicode character with uppercase letters', () => {
      assert.equal(isUnicodeChar('uCDEF'), true);
    });
    it('can invalidate a unicode character with the wrong escape', () => {
      assert.equal(isUnicodeChar('UCDEF'), false);
    });
    it('can invalidate a unicode character with the incorrect hex code (length)', () => {
      assert.equal(isUnicodeChar('uABC'), false);
    });
    it('can invalidate a unicode character with the incorrect hex characters', () => {
      assert.equal(isUnicodeChar('uGHIJ'), false);
    });
  });

  describe('isWhitespace', () => {
    it('can validate a space character as whitespace', () => {
      assert.equal(isWhitespace(' '), true);
    });
    it('can validate a backspace character as whitespace', () => {
      assert.equal(isWhitespace('\b'), true);
    });
    it('can validate a newline character as whitespace', () => {
      assert.equal(isWhitespace('\n'), true);
    });
    it('can validate a return character as whitespace', () => {
      assert.equal(isWhitespace('\r'), true);
    });
    it('can validate a tab character as whitespace', () => {
      assert.equal(isWhitespace('\t'), true);
    });
    it('can invalidate a non-whitespace character', () => {
      assert.equal(isWhitespace('\\'), false);
    });
  });
});
