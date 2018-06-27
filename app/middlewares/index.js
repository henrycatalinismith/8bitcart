const { createMiddleware } = require("signalbox");

const editor = require("./editor").default;
const viewport = require("./viewport").default;

export default createMiddleware([
  editor,
  viewport,
]);

