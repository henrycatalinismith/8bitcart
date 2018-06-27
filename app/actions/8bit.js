const { createActions } = require("signalbox");

export default createActions(["SYNTAX_ERROR"], types => ({
  syntaxError: (line, column, message) => ({
    type: types.SYNTAX_ERROR,
    line,
    column,
    message,
  }),
}));

