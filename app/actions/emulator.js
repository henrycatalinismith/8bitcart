const { createActions } = require("signalbox");

export default createActions([

  "START_EMULATOR",
  "STOP_EMULATOR",
  "SYNTAX_ERROR",
  "TICK_EMULATOR",

], types => ({

  startEmulator: code => ({
    type: types.START_EMULATOR,
    code,
  }),

  stopEmulator: () => ({
    type: types.STOP_EMULATOR,
  }),

  syntaxError: (line, column, message) => ({
    type: types.SYNTAX_ERROR,
    line,
    column,
    message,
  }),

  tickEmulator: memory => ({
    type: types.TICK_EMULATOR,
    memory,
  }),

}));

