const { createActions } = require("signalbox");

export default createActions([

  "START_EMULATOR",
  "STOP_EMULATOR",
  "RESIZE_EMULATOR",
  "SYNTAX_ERROR",
  "TICK_EMULATOR",
  "PARSE_CODE",

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

  parseCode: code => ({
    type: types.PARSE_CODE,
    code,
  }),

  tickEmulator: memory => ({
    type: types.TICK_EMULATOR,
    memory,
  }),

  resizeEmulator: height => ({
    type: types.RESIZE_EMULATOR,
    emulator: { height },
  }),

}));

