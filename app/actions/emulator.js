const { createActions } = require("signalbox");

export default createActions(["START_EMULATOR", "SYNTAX_ERROR"], types => ({
  startEmulator: code => ({
    type: types.START_EMULATOR,
    code
  }),

  syntaxError: (line, column, message) => ({
    type: types.SYNTAX_ERROR,
    line,
    column,
    message,
  }),
}));

