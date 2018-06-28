const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {
  code: ""
};

export const reducer = createReducer(initialState, {
  [actions.CHANGE_CODE](composer, action) {
    return {
      ...composer,
      code: action.composer.code,
    };
  },
});

export const selectors = {
  code: composer => composer.code,
};

