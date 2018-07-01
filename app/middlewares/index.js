const { createMiddleware } = require("signalbox");

const editor = require("./editor").default;
const emulator = require("./emulator").default;

export default createMiddleware([
  editor,
  emulator,
]);

