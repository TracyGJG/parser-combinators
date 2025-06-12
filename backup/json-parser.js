const DECIMALS = '123456789';
const DIGITS = `0${DECIMALS}`;

export default function JsonParser(jsonString) {
  const tokens = [];
  let pos = 0;
  let error = '';

  while (!error) {}
  return { tokens, error };

  function parseWhitespace() {
    const WHITESPACE = ' \t\r\n';
    while (
      pos >= 0 &&
      pos < jsonString.length &&
      WHITESPACE.includes(jsonString.at(pos))
    ) {
      tokens.push({ WHITESPACE: pos });
      pos++;
    }
  }

  function parseNumber() {
    if ('-' === jsonString.at(pos)) {
      pos++;
    }
    if ('0' === jsonString.at(pos)) {
      tokens.push({ NUMBER: pos });
      pos++;
    } else if (DECIMALS.includes(jsonString.at(pos))) {
      pos++;
      while (pos < jsonString.length && DIGITS.includes(jsonString.at(pos))) {
        pos++;
      }
    } else {
      error = `Invalid Number at ${pos}`;
    }

    !error && parseFraction(pos);
    !error && parseExponent(pos);
    tokens.push({ NUMBER: pos });
  }

  function parseFraction() {
    if ('.' === jsonString.at(pos)) {
      pos++;
    } else {
      error = `Invalid Fraction at ${pos}`;
    }
    while (pos < jsonString.length && DIGITS.includes(jsonString.at(pos))) {
      pos++;
    }
  }

  function parseExponent() {
    const EXPONENT = 'Ee';
    const SIGNS = '-+';
    if (EXPONENT.includes(jsonString.at(pos))) {
      pos++;
    } else {
      error = `Invalid Exponent at ${pos}`;
    }
    if (SIGNS.includes(jsonString.at(pos))) {
      pos++;
    }
    if (pos < jsonString.length && DIGITS.includes(jsonString.at(pos))) {
      pos++;
    } else {
      error = `Invalid Exponent at ${pos}`;
    }
    while (pos < jsonString.length && DIGITS.includes(jsonString.at(pos))) {
      pos++;
    }
  }
}
