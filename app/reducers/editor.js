const { createReducer } = require("signalbox");

const actions = require("../actions").default;

export const reducer = createReducer({}, {
  [actions.CHANGE_CODE](editor, action) {
    return {
      ...editor,
      code: action.editor.code,
      updated: new Date,
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
};

