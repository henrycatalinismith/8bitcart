const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {
};

export const reducer = createReducer(initialState, {
  [actions.RUN_EMULATOR](emulator, action) {
    return {
      ...emulator,
      lastAttempt: new Date,
    };
  },
});

export const selectors = {
  lastAttempt: emulator => emulator.lastAttempt,
};

