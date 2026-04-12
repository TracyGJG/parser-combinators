function lit(c) {
  return function (input) {
    var r = inputRead(input);
    if (r == c) {
      inputAdvance(input, 1);
      return c;
    } else {
      return failure;
    }
  };
}

{
  const input = ['a', 'b'];
  var parser = lit('a');
  console.ltable(input.map(parser));
}

function or(parser0, parser1) {
  return function (input) {
    var result0 = parser0(input);
    if (result0 != failure) {
      return result0;
    }
    var result1 = parser1(input);
    if (result1 != failure) {
      return result1;
    }
    return failure;
  };
}

{
  const input = ['a', 'b', 'c'];
  var parser = or(lit('a'), lit('b'));
  console.ltable(input.map(parser));
}

{
  function and(parser0, parser1) {
    return function (input) {
      var pos = inputGet(input);
      var result0 = parser0(input);
      if (result0 == failure) {
        inputSet(pos);
        return failure;
      }
      var result1 = parser1(input);
      if (result1 == failure) {
        inputSet(pos);
        return failure;
      }
      return result0 + result1;
    };
  }

  var parser = and(lit('a'), lit('b'));
  var result = parser(input);
}

{
  function and(parser0, parser1) {
    return function (input) {
      var pos = inputGet(input);
      var result0 = parser0(input);
      if (result0 == failure) {
        inputSet(pos);
        return failure;
      }
      var result1 = parser1(input);
      if (result1 == failure) {
        inputSet(pos);
        return failure;
      }
      return [result0, result1];
    };
  }

  var parser = or(and(lit('a'), lit('b')), and(lit('c'), lit('d')));

  var result = parser(input);
}

{
  function apply(f, parser) {
    return function (input) {
      var result = parser(input);
      if (result == failure) {
        return failure;
      } else {
        return f(result);
      }
    };
  }

  var parser = or(
    and(apply(toInt, lit('a')), apply(toInt, lit('b'))),
    and(apply(toInt, lit('c')), apply(toInt, lit('d')))
  );

  var result = parser(input);

  function lit_to_int(c) {
    return apply(toInt, lit(c));
  }

  var parser = or(
    and(lit_to_int('a'), lit_to_int('b')),
    and(lit_to_int('c'), lit_to_int('d'))
  );

  var result = parser(input);
}
