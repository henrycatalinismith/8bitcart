const { createMiddleware } = require("signalbox");

const eightbit = require("./8bit").default;
const editor = require("./editor").default;
const viewport = require("./viewport").default;

export default createMiddleware([
  eightbit,
  editor,
  viewport,
]);

