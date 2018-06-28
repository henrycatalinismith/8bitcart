const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {
};

export const reducer = createReducer(initialState, {
  /*
  [actions.CHANGE_CODE](emulator, action) {
    return {
      ...emulator,
    };
  },
  */
});

export const selectors = {
  //code: emulator => emulator.code,
};

