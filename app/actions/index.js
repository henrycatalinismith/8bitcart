const editor = require("./editor").default;
const emulator = require("./emulator").default;
const global = require("./global").default;
const viewport = require("./viewport").default;

const actions = Object.assign({},
  editor,
  emulator,
  global,
  viewport,
);

export default actions;
