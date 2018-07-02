const { createReducer } = require("signalbox");

const actions = require("../actions").default;

export const reducer = createReducer({}, {
  [actions.CHANGE_CODE](editor, action) {
    return {
      ...editor,
      code: action.editor.code,
      updated: new Date,
      syntaxErrorLine: undefined,
      syntaxErrorColumn: undefined,
      syntaxErrorMessage: undefined,
    };
  },

  [actions.SYNTAX_ERROR](editor, action) {
    return {
      ...editor,
      syntaxErrorLine: action.line,
      syntaxErrorColumn: action.column,
      syntaxErrorMessage: action.message,
    };
  },

  [actions.RESIZE_EMULATOR](editor, action) {
    return {
      ...editor,
      height: action.editor.height,
    };
  },
});

export const selectors = {
  started: editor => editor.started,
  updated: editor => editor.updated,
  code: editor => editor.code,
  width: editor => editor.width,
  height: editor => editor.height,
  syntaxError: editor => editor.syntaxErrorMessage ? ({
    line: editor.syntaxErrorLine,
    column: editor.syntaxErrorColumn,
    message: editor.syntaxErrorMessage,
  }) : undefined,
};

