const editor = require("./editor").default;
const emulator = require("./emulator").default;
const viewport = require("./viewport").default;

const actions = Object.assign({},
  editor,
  emulator,
  viewport,
);

export default actions;
