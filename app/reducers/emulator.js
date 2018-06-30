const { createReducer } = require("signalbox");

const actions = require("../actions").default;

const initialState = {};

export const reducer = createReducer(initialState, {
  [actions.START_EMULATOR](emulator, action) {
    return {
      ...emulator,
      running: true,
      started: new Date,
    };
  },

  [actions.SYNTAX_ERROR](emulator, action) {
    return {
      ...emulator,
      running: false,
      stopped: new Date,
    };
  },

  [actions.STOP_EMULATOR](emulator, action) {
    return {
      ...emulator,
      running: false,
      stopped: new Date,
    };
  },

  [actions.RESIZE_EMULATOR](emulator, action) {
    return {
      ...emulator,
      height: action.emulator.height,
    };
  },
});

export const selectors = {
  running: emulator => emulator.running,
  started: emulator => emulator.started,
  stopped: emulator => emulator.stopped,
  width: emulator => emulator.width,
  height: emulator => emulator.height,
};

