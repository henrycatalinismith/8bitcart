const { createMiddleware } = require("signalbox");

const composer = require("./composer").default;
const emulator = require("./emulator").default;
const viewport = require("./viewport").default;

export default createMiddleware([
  composer,
  emulator,
  viewport,
]);

