const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {
  code: ""
};

export const reducer = createReducer(initialState, {
  [actions.CHANGE_CODE](editor, action) {
    return {
      ...editor,
      code: action.editor.code,
    };
  },
});

export const selectors = {
  code: editor => editor.code,
};

