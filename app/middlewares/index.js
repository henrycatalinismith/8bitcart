const { createMiddleware } = require("signalbox");

const editor = require("./editor").default;
const emulator = require("./emulator").default;
const layout = require("./layout").default;

export default createMiddleware([
  editor,
  emulator,
  layout,
]);

