const { createActions } = require("signalbox");

export default createActions(["START"], types => ({
  start: () => ({ type: types.START })
}));
