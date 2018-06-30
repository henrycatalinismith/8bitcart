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

  [actions.RESIZE_EMULATOR](composer, action) {
    return {
      ...composer,
      height: action.composer.height,
    };
  },
});

export const selectors = {
  code: composer => composer.code,
  width: composer => composer.width,
  height: composer => composer.height,
};

