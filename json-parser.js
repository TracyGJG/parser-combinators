// const TOKENS = {
//     whitespace(state, result, error) { return {...state, error, index : error ? state.index + result.length : state.index, results:  }}
// };

// function sequence(...parsers) {
//   let parserIndex = 0;
//   return (state) => {
//     let newState = state;
//     while (!newState.error && parserIndex <= parser.length) {
//       newState = parsers[parserIndex++](newState);
//     }
//     return newState;
//   };
// }

// function choice(...parsers) {
//   let parserIndex = 0;
//   return (state) => {
//     if (state.error) return state;
//     let newState = state;
//     let parserPass = false;
//     if (parsers.length) {
//       while (!parserPass && parserIndex <= parser.length) {
//         newState = parsers[parserIndex++](newState);
//       }
//     }
//     return newState;
//   };
// }

// function optional(parser) {
//   return (state) => {
//     if (state.error) return state;
//     const newState = parser(state);
//     return newState.error ? state : newState;
//   };
// }

// function run(parsers) {
//     return (sourceData) {

//     }
// }

export function charParser(...chars) {
  if (!chars.length)
    throw new Error('charParser requires a list of characters to match');

  return (state) => {
    endParser()(state);
    if (state.error) return state;

    const test = state.data.at(state.index);
    return chars.includes(test)
      ? { ...state, index: state.index + 1 }
      : {
          ...state,
          error: `charParser: Expected one of the following [${chars.join(
            ', '
          )}] but encountered '${test}'.`,
        };
  };
}

export function textParser(text, caseSensitive = true) {
  if (!text.length) throw new Error('textParser requires a pattern to match');
  const test = caseSensitive
    ? (_text) => _text === text
    : (_text) => _text.toLowerCase() === text.toLowerCase();

  return (state) => {
    endParser()(state);
    if (state.error) return state;

    const _text = state.data.slice(state.index, state.index + _text.length);
    return test(_text)
      ? { ...state, index: state.index + _text.length }
      : {
          ...state,
          error: `textParser: Expected '${text}' but encountered '${_text}'.`,
        };
  };
}

export function endParser(marker) {
  return (state) => {
    if (state.error) return state;
    if (marker) {
      const _text = state.data.slice(state.index, state.index + marker.length);
      return {
        ...state,
        error:
          _text === marker
            ? `endParser: Expected end of input encountered.`
            : `endParser: Expected end marker'${marker}' but encountered '${_text}'.`,
      };
    }
    if (state.index >= state.data.length) {
      return {
        ...state,
        error: `endParser: Expected end of input encountered.`,
      };
    } else {
      return {
        ...state,
        error: `endParser: Expected end of input but more was found.`,
      };
    }
  };
}

// const digits = charParser(...'0123456789');
// const decimal = charParser(...'123456789');
// const whitespace = optional(
//     charParser(...' \n\r\t')
// );
