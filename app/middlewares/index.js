const { createMiddleware } = require("signalbox");

const editor = require("./editor").default;
const emulator = require("./emulator").default;
const viewport = require("./viewport").default;

export default createMiddleware([
  editor,
  emulator,
  viewport,
]);

