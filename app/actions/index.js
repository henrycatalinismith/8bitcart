const composer = require("./composer").default;
const emulator = require("./emulator").default;
const viewport = require("./viewport").default;

const actions = Object.assign({},
  composer,
  emulator,
  viewport,
);

export default actions;
